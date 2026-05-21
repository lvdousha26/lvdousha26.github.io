---
title: "AutoDL 14 天自動續命腳本"
description: "用 API 定時重建實例，防止 14 天免費實例被釋放"
keywords: "autodl,gpu,深度學習,免費算力,API,腳本"

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


AutoDL 免費實例**14 天自動釋放**，到期直接刪實例，系統盤數據全沒。最省心的方法：寫個腳本，每 13 天用 API 重建一次實例，重置倒計時。

<!--more-->

## 整體思路

```
新實例(第1天) → 跑實驗 → 第13天觸發腳本
  → 備份數據到文件存儲
  → API 創建新實例（同配置）
  → 從文件存儲恢復數據
  → API 釋放舊實例
  → 新實例接替，倒計時重置爲14天
```

用文件存儲(NFS)持久化數據，系統盤只放臨時環境。重建後掛載回去就行。

## 獲取 API Token

控制檯 → 賬號設置 → 開發者 Token，複製下來。

```bash
# 存爲環境變量
export AUTODL_TOKEN="你的token"
```

## 核心腳本

```python
#!/usr/bin/env python3
"""AutoDL 14天自動續命 — 重建實例並恢復環境"""
import requests, os, time, json

TOKEN = os.environ["AUTODL_TOKEN"]
HOST = "https://api.autodl.com"
HEADERS = {"Authorization": TOKEN, "Content-Type": "application/json"}

# ======== 按你的實例改這裏 ========
REGION = "beijingDC2"          # 地區
GPU_SPEC = "pro6000-p"         # GPU規格ID（見API文檔附錄）
IMAGE_ID = "image-xxxxxxxxx"   # 鏡像UUID（私有鏡像列表裏查）
INSTANCE_NAME = "auto-renew"
DATA_CENTER = ["beijingDC2"]   # 可多選
CUDA_MIN = 113                 # CUDA >= 11.3
GPU_COUNT = 1
DISK_EXPAND = 0               # 系統盤擴容(GB)
START_CMD = "sleep 1"          # 開機後自動執行的命令
# =================================


def _post(path, data=None):
    r = requests.post(f"{HOST}{path}", headers=HEADERS, json=data or {})
    return r.json()


def get_old_instance():
    """查當前實例列表，取最新一個"""
    r = _post("/api/v1/dev/instance/pro/list")
    items = r.get("data", {}).get("list", [])
    if not items:
        raise Exception("沒找到實例，先去控制檯手動創建一個")
    return items[0]


def release_instance(uuid):
    """先關機，再釋放"""
    _post("/api/v1/dev/instance/pro/power_off", {"instance_uuid": uuid})
    time.sleep(10)
    _post("/api/v1/dev/instance/pro/release", {"instance_uuid": uuid})
    print(f"  已釋放 {uuid}")


def create_instance():
    """用預設配置創建新實例"""
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
    print(f"  新實例 {uuid} 創建成功")
    return info


def wait_until_running(uuid, timeout=300):
    """等實例開機就緒"""
    for _ in range(timeout // 10):
        r = _post("/api/v1/dev/instance/pro/status", {"instance_uuid": uuid})
        status = r.get("data", {}).get("status")
        if status == "running":
            return True
        time.sleep(10)
    raise Exception("實例啓動超時")


def main():
    print("=== AutoDL 14天續命 ===")

    print("[1/4] 查舊實例...")
    old = get_old_instance()
    old_uuid = old["instance_uuid"]
    print(f"  舊實例: {old_uuid}")

    print("[2/4] 創建新實例...")
    new_info = create_instance()
    new_uuid = new_info["instance_uuid"]

    print("[3/4] 等新實例就緒...")
    wait_until_running(new_uuid)
    # 新實例開機後可通過 START_CMD 自動掛載文件存儲、拉代碼
    # 例如: START_CMD = "bash /root/setup.sh"

    print("[4/4] 釋放舊實例...")
    release_instance(old_uuid)

    print(f"=== 完成，新實例 {new_uuid}，倒計時重置 ===")


if __name__ == "__main__":
    main()
```

## 環境恢復

鏡像裏固化的環境不用動。每次 `pip install` 的包會丟，所以在 `START_CMD` 或 setup 腳本里搞定：

```bash
#!/bin/bash
# setup.sh — 新實例首次啓動時執行

# 掛載文件存儲（提前在控制檯創建好）
# 掛載後數據目錄直接可用

# 裝依賴（鏡像已有 conda/pytorch 就跳過）
pip install transformers datasets accelerate -q

# 拉最新代碼
cd /root && git clone git@github.com:you/project.git
```

把 `START_CMD` 改成 `"bash /root/setup.sh"`，每次重建自動跑一遍。

## 文件存儲 — 數據不丟的關鍵

系統盤隨實例釋放，**文件存儲(NFS)是獨立的**，實例刪了數據還在。新實例掛載同一個文件存儲即可。

控制檯 → 文件存儲 → 創建 → 記下掛載路徑。在 `setup.sh` 裏：

```bash
# AutoDL 文件存儲已自動掛載到 /root/autodl-fs
# 把訓練輸出、checkpoint、數據集放這裏
ln -s /root/autodl-fs/checkpoints /root/project/checkpoints
ln -s /root/autodl-fs/datasets /root/project/data
```

## 定時執行

在**本地**（不是實例上）設 cron，每 13 天跑一次：

```bash
# 編輯 crontab
crontab -e

# 每月 1 號和 14 號凌晨 3 點執行
0 3 1,14 * * AUTODL_TOKEN=xxx python3 /home/you/autodl-renew.py >> /home/you/autodl-renew.log 2>&1
```

也可以用 GitHub Actions 免費跑：

```yaml
# .github/workflows/autodl-renew.yml
name: AutoDL 14天續命
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

## 注意事項

- **文件存儲是唯一持久化的地方**，系統盤數據不備份必丟
- 新實例 SSH 地址會變，IP/端口每次都不同，看控制檯或 API 返回
- API 創建實例用的是**按量計費**，創建後就開始扣費，舊實例要立刻釋放
- GPU 規格 ID 查 API 文檔附錄，不同卡對應不同 `gpu_spec_uuid`
- 免費額度是**按賬號算的**，一個賬號同時只能有一個免費實例

## 常用速查

| 操作 | 命令/地址 |
|------|----------|
| 獲取 Token | 控制檯 → 設置 → 開發者 Token |
| API 文檔 | https://www.autodl.com/docs/instance_pro_api/ |
| GPU 規格 ID | 查 API 文檔附錄 |
| 鏡像 UUID | 控制檯 → 私有鏡像 → 鏡像詳情 |
| 查看餘額 | POST `/api/v1/dev/wallet/balance` |
