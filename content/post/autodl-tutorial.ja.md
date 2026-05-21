---
title: "AutoDL 14日間自動延命スクリプト"
description: "APIで定期的にインスタンスを再構築し、14日間無料インスタンスの解放を防止"
keywords: "autodl,gpu,深層学習,無料計算力,API,スクリプト"

date: 2026-05-20T00:00:00+08:00
lastmod: 2026-05-20T00:00:00+08:00

math: false
mermaid: false

categories:
  - チュートリアル
tags:
  - AutoDL
  - GPU
  - Python
  - チュートリアル
  - 便利ツール
---

AutoDLの無料インスタンスは**14日で自動解放**され、期間が来るとインスタンスは削除され、システムディスクのデータはすべて消えます。最も手間のかからない方法：スクリプトを作成し、13日ごとにAPIでインスタンスを再構築してカウントダウンをリセットします。

<!--more-->

## 全体の考え方

```
新インスタンス(1日目) → 実験を実行 → 13日目にスクリプト起動
  → データをファイルストレージにバックアップ
  → APIで新インスタンスを作成（同一設定）
  → ファイルストレージからデータを復元
  → APIで旧インスタンスを解放
  → 新インスタンスに切り替わり、カウントダウンが14日にリセット
```

ファイルストレージ（NFS）にデータを永続化し、システムディスクには一時的な環境のみ配置します。再構築後にマウントし直すだけです。

## API Tokenの取得

コンソール → アカウント設定 → 開発者Token、コピーしてください。

```bash
# 環境変数として保存
export AUTODL_TOKEN="あなたのtoken"
```

## コアスクリプト

```python
#!/usr/bin/env python3
"""AutoDL 14日間自動延命 — インスタンスを再構築して環境を復元"""
import requests, os, time, json

TOKEN = os.environ["AUTODL_TOKEN"]
HOST = "https://api.autodl.com"
HEADERS = {"Authorization": TOKEN, "Content-Type": "application/json"}

# ======== インスタンスに合わせてここを変更 ========
REGION = "beijingDC2"          # リージョン
GPU_SPEC = "pro6000-p"         # GPUスペックID（APIドキュメントの付録参照）
IMAGE_ID = "image-xxxxxxxxx"   # イメージUUID（プライベートイメージ一覧から確認）
INSTANCE_NAME = "auto-renew"
DATA_CENTER = ["beijingDC2"]   # 複数選択可
CUDA_MIN = 113                 # CUDA >= 11.3
GPU_COUNT = 1
DISK_EXPAND = 0               # システムディスク拡張(GB)
START_CMD = "sleep 1"          # 起動後に自動実行するコマンド
# =================================


def _post(path, data=None):
    r = requests.post(f"{HOST}{path}", headers=HEADERS, json=data or {})
    return r.json()


def get_old_instance():
    """現在のインスタンス一覧から最新のものを取得"""
    r = _post("/api/v1/dev/instance/pro/list")
    items = r.get("data", {}).get("list", [])
    if not items:
        raise Exception("インスタンスが見つかりません。先にコンソールから手動で作成してください")
    return items[0]


def release_instance(uuid):
    """まずシャットダウンし、その後解放"""
    _post("/api/v1/dev/instance/pro/power_off", {"instance_uuid": uuid})
    time.sleep(10)
    _post("/api/v1/dev/instance/pro/release", {"instance_uuid": uuid})
    print(f"  解放完了 {uuid}")


def create_instance():
    """プリセット設定で新インスタンスを作成"""
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
    print(f"  新インスタンス {uuid} 作成成功")
    return info


def wait_until_running(uuid, timeout=300):
    """インスタンスの起動完了を待つ"""
    for _ in range(timeout // 10):
        r = _post("/api/v1/dev/instance/pro/status", {"instance_uuid": uuid})
        status = r.get("data", {}).get("status")
        if status == "running":
            return True
        time.sleep(10)
    raise Exception("インスタンスの起動がタイムアウトしました")


def main():
    print("=== AutoDL 14日間延命 ===")

    print("[1/4] 旧インスタンスを確認...")
    old = get_old_instance()
    old_uuid = old["instance_uuid"]
    print(f"  旧インスタンス: {old_uuid}")

    print("[2/4] 新インスタンスを作成...")
    new_info = create_instance()
    new_uuid = new_info["instance_uuid"]

    print("[3/4] 新インスタンスの準備完了を待機...")
    wait_until_running(new_uuid)
    # 新インスタンス起動後、START_CMDでファイルストレージのマウントやコード取得を自動実行
    # 例: START_CMD = "bash /root/setup.sh"

    print("[4/4] 旧インスタンスを解放...")
    release_instance(old_uuid)

    print(f"=== 完了、新インスタンス {new_uuid}、カウントダウンリセット ===")


if __name__ == "__main__":
    main()
```

## 環境の復元

イメージに固定化した環境はそのままです。`pip install` したパッケージは消えるので、`START_CMD` やセットアップスクリプトで対処します：

```bash
#!/bin/bash
# setup.sh — 新インスタンス初回起動時に実行

# ファイルストレージをマウント（事前にコンソールで作成しておく）
# マウント後、データディレクトリはすぐに利用可能

# 依存関係をインストール（イメージにconda/pytorchがあればスキップ）
pip install transformers datasets accelerate -q

# 最新コードを取得
cd /root && git clone git@github.com:you/project.git
```

`START_CMD` を `"bash /root/setup.sh"` に変更すれば、再構築のたびに自動実行されます。

## ファイルストレージ — データ消失防止の鍵

システムディスクはインスタンスと共に解放されますが、**ファイルストレージ（NFS）は独立しており**、インスタンスを削除してもデータは残ります。新インスタンスで同じファイルストレージをマウントするだけです。

コンソール → ファイルストレージ → 作成 → マウントパスを控えます。`setup.sh` で：

```bash
# AutoDLのファイルストレージは自動的に /root/autodl-fs にマウントされる
# 訓練出力、チェックポイント、データセットはここに配置
ln -s /root/autodl-fs/checkpoints /root/project/checkpoints
ln -s /root/autodl-fs/datasets /root/project/data
```

## 定期実行

**ローカル環境**（インスタンス上ではなく）でcronを設定し、13日ごとに実行：

```bash
# crontabを編集
crontab -e

# 毎月1日と14日の午前3時に実行
0 3 1,14 * * AUTODL_TOKEN=xxx python3 /home/you/autodl-renew.py >> /home/you/autodl-renew.log 2>&1
```

GitHub Actionsを使って無料で実行することもできます：

```yaml
# .github/workflows/autodl-renew.yml
name: AutoDL 14日間延命
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

- **ファイルストレージだけが永続化される場所です**。システムディスクのデータはバックアップしないと必ず失われます
- 新インスタンスのSSHアドレスは変わります。IP/ポートは毎回異なるので、コンソールまたはAPIの戻り値を確認してください
- APIで作成するインスタンスは**従量課金**です。作成後すぐに課金が始まるので、旧インスタンスは速やかに解放してください
- GPUスペックIDはAPIドキュメントの付録を参照。異なるGPUは異なる `gpu_spec_uuid` に対応します
- 無料枠は**アカウント単位**です。1つのアカウントで同時に持てる無料インスタンスは1つのみ

## よく使う情報

| 操作 | コマンド／アドレス |
|------|----------|
| Token取得 | コンソール → 設定 → 開発者Token |
| APIドキュメント | https://www.autodl.com/docs/instance_pro_api/ |
| GPUスペックID | APIドキュメントの付録を参照 |
| イメージUUID | コンソール → プライベートイメージ → イメージ詳細 |
| 残高確認 | POST `/api/v1/dev/wallet/balance` |
