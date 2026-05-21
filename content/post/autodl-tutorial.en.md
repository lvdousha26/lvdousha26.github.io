---
title: "AutoDL 14-Day Auto-Renewal Script"
description: "Use the API to periodically recreate instances, preventing 14-day free instances from being released"
keywords: "autodl,gpu,deep learning,free compute,API,script"

date: 2026-05-20T00:00:00+08:00
lastmod: 2026-05-20T00:00:00+08:00

math: false
mermaid: false

categories:
  - Tutorial
tags:
  - AutoDL
  - GPU
  - Python
  - Tutorial
  - Tools
---

AutoDL free instances are **auto-released after 14 days**. When the deadline hits, the instance is deleted and all system disk data is lost. The most hassle-free solution: write a script that uses the API to rebuild the instance every 13 days, resetting the countdown.

<!--more-->

## Overall Approach

```
New instance (Day 1) → Run experiments → Day 13: trigger script
  → Backup data to file storage
  → API creates a new instance (same configuration)
  → Restore data from file storage
  → API releases the old instance
  → New instance takes over, countdown resets to 14 days
```

Use file storage (NFS) for persistent data; the system disk only holds the temporary environment. After rebuilding, simply remount it.

## Get Your API Token

Console → Account Settings → Developer Token, copy it.

```bash
# Save as environment variable
export AUTODL_TOKEN="your_token"
```

## Core Script

```python
#!/usr/bin/env python3
"""AutoDL 14-Day Auto-Renewal — rebuild instance and restore environment"""
import requests, os, time, json

TOKEN = os.environ["AUTODL_TOKEN"]
HOST = "https://api.autodl.com"
HEADERS = {"Authorization": TOKEN, "Content-Type": "application/json"}

# ======== Modify these for your instance ========
REGION = "beijingDC2"          # Region
GPU_SPEC = "pro6000-p"         # GPU spec ID (see API doc appendix)
IMAGE_ID = "image-xxxxxxxxx"   # Image UUID (check private image list)
INSTANCE_NAME = "auto-renew"
DATA_CENTER = ["beijingDC2"]   # Can select multiple
CUDA_MIN = 113                 # CUDA >= 11.3
GPU_COUNT = 1
DISK_EXPAND = 0                # System disk expansion (GB)
START_CMD = "sleep 1"          # Command to run on startup
# =================================


def _post(path, data=None):
    r = requests.post(f"{HOST}{path}", headers=HEADERS, json=data or {})
    return r.json()


def get_old_instance():
    """Check current instance list, get the latest one"""
    r = _post("/api/v1/dev/instance/pro/list")
    items = r.get("data", {}).get("list", [])
    if not items:
        raise Exception("No instances found. Create one manually in the console first.")
    return items[0]


def release_instance(uuid):
    """Power off first, then release"""
    _post("/api/v1/dev/instance/pro/power_off", {"instance_uuid": uuid})
    time.sleep(10)
    _post("/api/v1/dev/instance/pro/release", {"instance_uuid": uuid})
    print(f"  Released {uuid}")


def create_instance():
    """Create a new instance with preset configuration"""
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
    print(f"  New instance {uuid} created successfully")
    return info


def wait_until_running(uuid, timeout=300):
    """Wait for the instance to be ready"""
    for _ in range(timeout // 10):
        r = _post("/api/v1/dev/instance/pro/status", {"instance_uuid": uuid})
        status = r.get("data", {}).get("status")
        if status == "running":
            return True
        time.sleep(10)
    raise Exception("Instance startup timed out")


def main():
    print("=== AutoDL 14-Day Renewal ===")

    print("[1/4] Finding old instance...")
    old = get_old_instance()
    old_uuid = old["instance_uuid"]
    print(f"  Old instance: {old_uuid}")

    print("[2/4] Creating new instance...")
    new_info = create_instance()
    new_uuid = new_info["instance_uuid"]

    print("[3/4] Waiting for new instance to be ready...")
    wait_until_running(new_uuid)
    # After boot, the new instance can auto-mount file storage and pull code via START_CMD
    # For example: START_CMD = "bash /root/setup.sh"

    print("[4/4] Releasing old instance...")
    release_instance(old_uuid)

    print(f"=== Done, new instance {new_uuid}, countdown reset ===")


if __name__ == "__main__":
    main()
```

## Environment Restoration

Environments baked into the image don't need to be touched. Packages installed via `pip install` will be lost, so handle them in `START_CMD` or a setup script:

```bash
#!/bin/bash
# setup.sh — runs on first startup of a new instance

# Mount file storage (create it in the console beforehand)
# After mounting, the data directory is directly accessible

# Install dependencies (skip if the image already has conda/pytorch)
pip install transformers datasets accelerate -q

# Pull the latest code
cd /root && git clone git@github.com:you/project.git
```

Set `START_CMD` to `"bash /root/setup.sh"`, and it will run automatically every time the instance is rebuilt.

## File Storage — The Key to Not Losing Data

The system disk is released along with the instance, but **file storage (NFS) is independent** — your data survives instance deletion. Just mount the same file storage on the new instance.

Console → File Storage → Create → Note the mount path. In `setup.sh`:

```bash
# AutoDL file storage is automatically mounted at /root/autodl-fs
# Place training outputs, checkpoints, and datasets here
ln -s /root/autodl-fs/checkpoints /root/project/checkpoints
ln -s /root/autodl-fs/datasets /root/project/data
```

## Scheduled Execution

Set up a cron job **locally** (not on the instance) to run every 13 days:

```bash
# Edit crontab
crontab -e

# Run at 3 AM on the 1st and 14th of every month
0 3 1,14 * * AUTODL_TOKEN=xxx python3 /home/you/autodl-renew.py >> /home/you/autodl-renew.log 2>&1
```

You can also use GitHub Actions for free:

```yaml
# .github/workflows/autodl-renew.yml
name: AutoDL 14-Day Renewal
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

## Important Notes

- **File storage is the only place for persistence** — system disk data will be lost without backup
- The new instance's SSH address will change; IP/port differs every time, check the console or API response
- Instances created via the API are **pay-as-you-go**; billing starts immediately after creation, so release the old instance promptly
- GPU spec IDs are listed in the API doc appendix; different GPUs have different `gpu_spec_uuid` values
- Free credits are **per account**; only one free instance per account at a time

## Quick Reference

| Action | Command/Address |
|--------|----------------|
| Get Token | Console → Settings → Developer Token |
| API Docs | https://www.autodl.com/docs/instance_pro_api/ |
| GPU Spec ID | See API doc appendix |
| Image UUID | Console → Private Images → Image Details |
| Check Balance | POST `/api/v1/dev/wallet/balance` |
