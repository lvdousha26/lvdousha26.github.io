---
title: "AutoDL 14 天自动续命脚本"
description: "用 API 定时重建实例，防止 14 天免费实例被释放"
keywords: "autodl,gpu,深度学习,免费算力,API,脚本"

date: 2026-05-20T00:00:00+08:00
lastmod: 2026-05-20T00:00:00+08:00

math: false
mermaid: false

categories:
  - 教程
tags:
  - AutoDL
  - GPU
  - Python
  - 教程
  - 小工具
---

AutoDL 免费实例**14 天自动释放**，到期直接删实例，系统盘数据全没。最省心的方法：写个脚本，每 13 天用 API 重建一次实例，重置倒计时。

<!--more-->

## 整体思路

```
新实例(第1天) → 跑实验 → 第13天触发脚本
  → 备份数据到文件存储
  → API 创建新实例（同配置）
  → 从文件存储恢复数据
  → API 释放旧实例
  → 新实例接替，倒计时重置为14天
```

用文件存储(NFS)持久化数据，系统盘只放临时环境。重建后挂载回去就行。

## 获取 API Token

控制台 → 账号设置 → 开发者 Token，复制下来。

```bash
# 存为环境变量
export AUTODL_TOKEN="你的token"
```

## 核心脚本

```python
#!/usr/bin/env python3
"""AutoDL 14天自动续命 — 重建实例并恢复环境"""
import requests, os, time, json

TOKEN = os.environ["AUTODL_TOKEN"]
HOST = "https://api.autodl.com"
HEADERS = {"Authorization": TOKEN, "Content-Type": "application/json"}

# ======== 按你的实例改这里 ========
REGION = "beijingDC2"          # 地区
GPU_SPEC = "pro6000-p"         # GPU规格ID（见API文档附录）
IMAGE_ID = "image-xxxxxxxxx"   # 镜像UUID（私有镜像列表里查）
INSTANCE_NAME = "auto-renew"
DATA_CENTER = ["beijingDC2"]   # 可多选
CUDA_MIN = 113                 # CUDA >= 11.3
GPU_COUNT = 1
DISK_EXPAND = 0               # 系统盘扩容(GB)
START_CMD = "sleep 1"          # 开机后自动执行的命令
# =================================


def _post(path, data=None):
    r = requests.post(f"{HOST}{path}", headers=HEADERS, json=data or {})
    return r.json()


def get_old_instance():
    """查当前实例列表，取最新一个"""
    r = _post("/api/v1/dev/instance/pro/list")
    items = r.get("data", {}).get("list", [])
    if not items:
        raise Exception("没找到实例，先去控制台手动创建一个")
    return items[0]


def release_instance(uuid):
    """先关机，再释放"""
    _post("/api/v1/dev/instance/pro/power_off", {"instance_uuid": uuid})
    time.sleep(10)
    _post("/api/v1/dev/instance/pro/release", {"instance_uuid": uuid})
    print(f"  已释放 {uuid}")


def create_instance():
    """用预设配置创建新实例"""
    data = {
        "data_center_list": DATA_CENTER,
        "req_gpu_amount": GPU_COUNT,
        "expand_system_disk_by_gb": DISK_EXPAND,
        "gpu_spec_uuid": GPU_SPEC,
        "image_uuid": IMAGE_ID,
        "cuda_v_from": CUDA_MIN,
        "instance_name": INSTANCE_NAME,
        "start_command": START_CMD,
    }
    r = _post("/api/v1/dev/instance/pro/create", data)
    info = r.get("data", {})
    uuid = info.get("instance_uuid")
    print(f"  新实例 {uuid} 创建成功")
    return info


def wait_until_running(uuid, timeout=300):
    """等实例开机就绪"""
    for _ in range(timeout // 10):
        r = _post("/api/v1/dev/instance/pro/status", {"instance_uuid": uuid})
        status = r.get("data", {}).get("status")
        if status == "running":
            return True
        time.sleep(10)
    raise Exception("实例启动超时")


def main():
    print("=== AutoDL 14天续命 ===")

    print("[1/4] 查旧实例...")
    old = get_old_instance()
    old_uuid = old["instance_uuid"]
    print(f"  旧实例: {old_uuid}")

    print("[2/4] 创建新实例...")
    new_info = create_instance()
    new_uuid = new_info["instance_uuid"]

    print("[3/4] 等新实例就绪...")
    wait_until_running(new_uuid)
    # 新实例开机后可通过 START_CMD 自动挂载文件存储、拉代码
    # 例如: START_CMD = "bash /root/setup.sh"

    print("[4/4] 释放旧实例...")
    release_instance(old_uuid)

    print(f"=== 完成，新实例 {new_uuid}，倒计时重置 ===")


if __name__ == "__main__":
    main()
```

## 环境恢复

镜像里固化的环境不用动。每次 `pip install` 的包会丢，所以在 `START_CMD` 或 setup 脚本里搞定：

```bash
#!/bin/bash
# setup.sh — 新实例首次启动时执行

# 挂载文件存储（提前在控制台创建好）
# 挂载后数据目录直接可用

# 装依赖（镜像已有 conda/pytorch 就跳过）
pip install transformers datasets accelerate -q

# 拉最新代码
cd /root && git clone git@github.com:you/project.git
```

把 `START_CMD` 改成 `"bash /root/setup.sh"`，每次重建自动跑一遍。

## 文件存储 — 数据不丢的关键

系统盘随实例释放，**文件存储(NFS)是独立的**，实例删了数据还在。新实例挂载同一个文件存储即可。

控制台 → 文件存储 → 创建 → 记下挂载路径。在 `setup.sh` 里：

```bash
# AutoDL 文件存储已自动挂载到 /root/autodl-fs
# 把训练输出、checkpoint、数据集放这里
ln -s /root/autodl-fs/checkpoints /root/project/checkpoints
ln -s /root/autodl-fs/datasets /root/project/data
```

## 定时执行

在**本地**（不是实例上）设 cron，每 13 天跑一次：

```bash
# 编辑 crontab
crontab -e

# 每月 1 号和 14 号凌晨 3 点执行
0 3 1,14 * * AUTODL_TOKEN=xxx python3 /home/you/autodl-renew.py >> /home/you/autodl-renew.log 2>&1
```

也可以用 GitHub Actions 免费跑：

```yaml
# .github/workflows/autodl-renew.yml
name: AutoDL 14天续命
on:
  schedule:
    - cron: "0 3 1,14 * *"
  workflow_dispatch:
jobs:
  renew:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install requests && python3 autodl-renew.py
        env:
          AUTODL_TOKEN: ${{ secrets.AUTODL_TOKEN }}
```

## 注意事项

- **文件存储是唯一持久化的地方**，系统盘数据不备份必丢
- 新实例 SSH 地址会变，IP/端口每次都不同，看控制台或 API 返回
- API 创建实例用的是**按量计费**，创建后就开始扣费，旧实例要立刻释放
- GPU 规格 ID 查 API 文档附录，不同卡对应不同 `gpu_spec_uuid`
- 免费额度是**按账号算的**，一个账号同时只能有一个免费实例

## 常用速查

| 操作 | 命令/地址 |
|------|----------|
| 获取 Token | 控制台 → 设置 → 开发者 Token |
| API 文档 | https://www.autodl.com/docs/instance_pro_api/ |
| GPU 规格 ID | 查 API 文档附录 |
| 镜像 UUID | 控制台 → 私有镜像 → 镜像详情 |
| 查看余额 | POST `/api/v1/dev/wallet/balance` |
