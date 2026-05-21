---
title: "PyTorch 入門"
description: "初心者向けPyTorch実用チュートリアル：テンソル操作、自動微分、データローダ、モデル訓練"
keywords: "pytorch,深層学習,ニューラルネットワーク,チュートリアル"

date: 2026-05-19T00:00:00+08:00
lastmod: 2026-05-19T00:00:00+08:00

math: false
mermaid: false

categories:
  - チュートリアル
tags:
  - PyTorch
  - 深層学習
  - チュートリアル
  - 便利ツール
---

## なぜPyTorchを選ぶのか

深層学習フレームワークは大きく二大勢力に分けられる：PyTorch（Meta）とTensorFlow（Google）。2026年現在、PyTorchは学术界と産業界で完全にリードしており、論文の再現、トップ会議のコード、HuggingFaceエコシステムのほとんどがPyTorchベース。

中核的な強み：**動的計算グラフ**（define-by-run）。デバッグや修正がPythonを書くのと同じくらい自然に行える。

<!--more-->

## インストール

```bash
# CPU版
pip install torch

# CUDA版（NVIDIA GPU搭載時）
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124

# 確認
python -c "import torch; print(torch.__version__); print(torch.cuda.is_available())"
```

## テンソル：PyTorchの基本単位

テンソル（Tensor）は多次元配列で、NumPyの `ndarray` とほぼ同じだが、GPU上で演算可能。

```python
import torch
import numpy as np

# テンソルの作成
a = torch.tensor([1, 2, 3])
b = torch.zeros(3, 4)           # すべて0
c = torch.ones(2, 3)            # すべて1
d = torch.randn(3, 4)           # 標準正規分布
e = torch.arange(0, 10, 2)     # [0, 2, 4, 6, 8]

# NumPyとの相互変換
arr = np.array([1, 2, 3])
t = torch.from_numpy(arr)       # ndarray → tensor
arr2 = t.numpy()                # tensor → ndarray（CPU上のみ有効）

# 属性
print(d.shape)      # torch.Size([3, 4])
print(d.dtype)      # torch.float32
print(d.device)     # cpu

# GPUへの移動
if torch.cuda.is_available():
    d = d.cuda()    # または d.to('cuda')
```

## テンソル演算

```python
x = torch.randn(3, 4)
y = torch.randn(3, 4)

# 要素ごとの演算
z = x + y        # 加算
z = x * y        # 要素ごとの乗算（行列積ではない）
z = torch.exp(x)

# 行列積
z = x @ y.T      # @ は行列積
z = torch.mm(x, y.T)   # 同等の記法

# 次元操作
x = torch.randn(2, 3, 4)
x = x.reshape(2, 12)        # 変形
x = x.view(-1, 12)          # reshapeに類似、ただしメモリ連続性が必要
x = x.squeeze()             # サイズ1の次元を除去
x = x.unsqueeze(0)          # 位置0に次元を追加

# インデックス
x[:, 0, :]                  # NumPyスライスと同様
x[x > 0]                    # ブールインデックス
torch.cat([x, y], dim=0)    # 結合
```

## 自動微分：深層学習の魔法

```python
# 勾配計算が必要なテンソルには requires_grad=True
x = torch.tensor([2.0, 3.0], requires_grad=True)
y = x[0]**2 + x[1]**3       # y = 4 + 27 = 31

# 逆伝播
y.backward()
print(x.grad)   # dy/dx = [2*x0, 3*x1^2] = [4.0, 27.0]

# 勾配のリセット（毎回のbackward前に必要）
x.grad.zero_()
```

学習ループでの標準パターン：

```python
# 典型的な1ステップの訓練
optimizer.zero_grad()   # 勾配をゼロにリセット
loss = model(x, y)      # 順伝播
loss.backward()         # 逆伝播で勾配計算
optimizer.step()        # パラメータ更新
```

## ニューラルネットワークの構築

```python
import torch.nn as nn
import torch.nn.functional as F

class SimpleNet(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim):
        super().__init__()
        self.fc1 = nn.Linear(input_dim, hidden_dim)
        self.fc2 = nn.Linear(hidden_dim, output_dim)
        self.dropout = nn.Dropout(0.3)

    def forward(self, x):
        x = F.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.fc2(x)
        return x

model = SimpleNet(784, 256, 10)
print(model)
# パラメータ数の表示
print(f"パラメータ数: {sum(p.numel() for p in model.parameters()):,}")
```

### よく使うレイヤー一覧

```python
nn.Linear(in, out)       # 全結合層
nn.Conv2d(in_c, out_c, k)# 2次元畳み込み
nn.BatchNorm2d(c)        # バッチ正規化
nn.LayerNorm(dim)        # 層正規化（Transformer標準）
nn.LSTM(in, hidden)      # LSTM層
nn.Dropout(p)            # Dropout正則化
nn.Embedding(vocab, dim) # 単語埋め込み層
```

### 活性化関数

```python
F.relu(x)       # 最も一般的、負の値を0に
F.gelu(x)       # Transformer標準
F.sigmoid(x)    # 出力0〜1、二値分類
F.tanh(x)       # 出力-1〜1
F.softmax(x, dim=-1)  # 多クラス分類の確率
```

## データローダ

```python
from torch.utils.data import DataLoader, Dataset

class MyDataset(Dataset):
    def __init__(self, data, labels):
        self.data = data
        self.labels = labels

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        return self.data[idx], self.labels[idx]

# 通常は torchvision の組み込みデータセットを使用
from torchvision import datasets, transforms

transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,))
])

train_data = datasets.MNIST(
    root='./data', train=True,
    download=True, transform=transform
)

train_loader = DataLoader(
    train_data, batch_size=64,
    shuffle=True, num_workers=4
)
```

## 完全な訓練ループ

```python
import torch.optim as optim

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = SimpleNet(784, 256, 10).to(device)

criterion = nn.CrossEntropyLoss()    # 損失関数
optimizer = optim.Adam(model.parameters(), lr=0.001)

num_epochs = 10
for epoch in range(num_epochs):
    model.train()
    total_loss = 0
    for batch_idx, (data, target) in enumerate(train_loader):
        data, target = data.to(device), target.to(device)
        data = data.view(data.size(0), -1)  # 画像を平坦化

        optimizer.zero_grad()
        output = model(data)
        loss = criterion(output, target)
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    print(f"Epoch {epoch+1}, Loss: {total_loss/len(train_loader):.4f}")
```

## 評価と予測

```python
@torch.no_grad()  # 勾配計算をオフにし、メモリ節約
def evaluate(model, loader):
    model.eval()
    correct = 0
    total = 0
    for data, target in loader:
        data, target = data.to(device), target.to(device)
        data = data.view(data.size(0), -1)
        output = model(data)
        _, predicted = output.max(1)       # 確率最大のクラスを取得
        total += target.size(0)
        correct += predicted.eq(target).sum().item()
    return correct / total

print(f"正解率: {evaluate(model, test_loader):.2%}")
```

## 保存と読み込み

```python
# 保存（state_dict の保存を推奨）
torch.save(model.state_dict(), 'model.pth')
# checkpointの保存（オプティマイザの状態を含め、途中再開に便利）
torch.save({
    'epoch': epoch,
    'model_state_dict': model.state_dict(),
    'optimizer_state_dict': optimizer.state_dict(),
    'loss': loss,
}, 'checkpoint.pth')

# 読み込み
model = SimpleNet(784, 256, 10)
model.load_state_dict(torch.load('model.pth'))
model.eval()  # 推論モード
```

## よくある問題と対処法

```python
# 次元不一致：各層のshapeを確認
print(x.shape)

# GPUメモリオーバーフロー
torch.cuda.empty_cache()
# batch_sizeを減らすか、勾配蓄積を使用

# 勾配爆発／消失
# 勾配ノルムを表示
total_norm = 0
for p in model.parameters():
    if p.grad is not None:
        total_norm += p.grad.norm().item() ** 2
print(f"Gradient norm: {total_norm**0.5:.4f}")
# > 10 なら爆発の可能性、< 1e-6 なら消失の可能性

# 過学習
# Dropout、データ拡張、weight decay、早期停止
```

## 学習ロードマップ

| 段階 | 内容 | 想定時間 |
|------|------|----------|
| 入門 | テンソル演算 + 自動微分 | 1日 |
| 基礎 | 自分でMLP + 訓練ループを実装 | 2日 |
| 発展 | CNN/LSTM/Transformer + データローダ | 1週間 |
| 実戦 | 論文のコードを再現 | 1-2週間 |
| 上級 | torch.compile / FSDP / 混合精度 | 使いながら学ぶ |

## よく使う操作一覧

| 操作 | コード |
|------|--------|
| テンソル作成 | `torch.randn(n, m)` |
| GPUへ移動 | `x.to('cuda')` |
| 行列積 | `x @ y.T` |
| 自動微分 | `loss.backward()` |
| モデル定義 | `class Net(nn.Module):` |
| 損失関数 | `nn.CrossEntropyLoss()` |
| オプティマイザ | `optim.Adam(model.parameters(), lr=1e-3)` |
| データ読み込み | `DataLoader(dataset, batch_size, shuffle)` |
| 推論モード | `@torch.no_grad()` |
| パラメータ保存 | `torch.save(model.state_dict(), path)` |
