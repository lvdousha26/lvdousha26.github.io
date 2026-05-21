---
title: "PyTorch 入門"
description: "面向初學者的 PyTorch 實用教程，覆蓋張量操作、自動求導、數據加載和模型訓練"
keywords: "pytorch,深度學習,神經網絡,教程"

date: 2026-05-19T00:00:00+08:00
lastmod: 2026-05-19T00:00:00+08:00

math: false
mermaid: false

categories:
  - 教程
tags:
  - PyTorch
  - 深度學習
  - 教程
  - 小工具
---


## 爲什麼選 PyTorch

深度學習框架分兩大陣營：PyTorch（Meta）和 TensorFlow（Google）。2026 年，PyTorch 已在學術界和工業界全面領先——論文復現、頂會代碼、HuggingFace 生態幾乎全基於 PyTorch。

核心優勢：**動態計算圖**（define-by-run），調試和修改跟在寫 Python 一樣自然。

<!--more-->

## 安裝

```bash
# CPU 版
pip install torch

# CUDA 版（有 NVIDIA 顯卡）
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124

# 驗證
python -c "import torch; print(torch.__version__); print(torch.cuda.is_available())"
```

## 張量：PyTorch 的基本單元

張量（Tensor）就是多維數組，和 NumPy 的 `ndarray` 幾乎一樣，但可以在 GPU 上運算。

```python
import torch
import numpy as np

# 創建張量
a = torch.tensor([1, 2, 3])
b = torch.zeros(3, 4)           # 全 0
c = torch.ones(2, 3)            # 全 1
d = torch.randn(3, 4)           # 標準正態分佈
e = torch.arange(0, 10, 2)     # [0, 2, 4, 6, 8]

# 從 NumPy 互轉
arr = np.array([1, 2, 3])
t = torch.from_numpy(arr)       # ndarray → tensor
arr2 = t.numpy()                # tensor → ndarray（僅 CPU 上有效）

# 屬性
print(d.shape)      # torch.Size([3, 4])
print(d.dtype)      # torch.float32
print(d.device)     # cpu

# GPU 遷移
if torch.cuda.is_available():
    d = d.cuda()    # 或 d.to('cuda')
```

## 張量運算

```python
x = torch.randn(3, 4)
y = torch.randn(3, 4)

# 逐元素運算
z = x + y        # 加法
z = x * y        # 逐元素乘法（不是矩陣乘法）
z = torch.exp(x)

# 矩陣乘法
z = x @ y.T      # @ 是矩陣乘法
z = torch.mm(x, y.T)   # 等價寫法

# 維度操作
x = torch.randn(2, 3, 4)
x = x.reshape(2, 12)        # 變形
x = x.view(-1, 12)          # 類似 reshape，但要求內存連續
x = x.squeeze()             # 去掉大小爲 1 的維度
x = x.unsqueeze(0)          # 在位置 0 添加一個維度

# 索引
x[:, 0, :]                  # 類似 NumPy 切片
x[x > 0]                    # 布爾索引
torch.cat([x, y], dim=0)    # 拼接
```

## 自動求導：深度學習的魔法

```python
# 需要求導的張量設置 requires_grad=True
x = torch.tensor([2.0, 3.0], requires_grad=True)
y = x[0]**2 + x[1]**3       # y = 4 + 27 = 31

# 反向傳播
y.backward()
print(x.grad)   # dy/dx = [2*x0, 3*x1^2] = [4.0, 27.0]

# 梯度清零（每次 backward 前都需要）
x.grad.zero_()
```

訓練循環中的標準 pattern：

```python
# 典型訓練一步
optimizer.zero_grad()   # 清零梯度
loss = model(x, y)      # 前向計算
loss.backward()         # 反向求梯度
optimizer.step()        # 更新參數
```

## 構建神經網絡

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
# 打印參數量
print(f"參數量: {sum(p.numel() for p in model.parameters()):,}")
```

### 常用層速查

```python
nn.Linear(in, out)       # 全連接層
nn.Conv2d(in_c, out_c, k)# 二維卷積
nn.BatchNorm2d(c)        # 批歸一化
nn.LayerNorm(dim)        # 層歸一化（Transformer 標配）
nn.LSTM(in, hidden)      # LSTM 層
nn.Dropout(p)            # Dropout 正則化
nn.Embedding(vocab, dim) # 詞嵌入層
```

### 激活函數

```python
F.relu(x)       # 最常用，負數歸零
F.gelu(x)       # Transformer 標配
F.sigmoid(x)    # 輸出 0~1，二分類
F.tanh(x)       # 輸出 -1~1
F.softmax(x, dim=-1)  # 多分類概率
```

## 數據加載

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

# 通常使用 torchvision 內置數據集
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

## 完整訓練循環

```python
import torch.optim as optim

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = SimpleNet(784, 256, 10).to(device)

criterion = nn.CrossEntropyLoss()    # 損失函數
optimizer = optim.Adam(model.parameters(), lr=0.001)

num_epochs = 10
for epoch in range(num_epochs):
    model.train()
    total_loss = 0
    for batch_idx, (data, target) in enumerate(train_loader):
        data, target = data.to(device), target.to(device)
        data = data.view(data.size(0), -1)  # 展平圖片

        optimizer.zero_grad()
        output = model(data)
        loss = criterion(output, target)
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    print(f"Epoch {epoch+1}, Loss: {total_loss/len(train_loader):.4f}")
```

## 評估與預測

```python
@torch.no_grad()  # 關閉梯度計算，節省顯存
def evaluate(model, loader):
    model.eval()
    correct = 0
    total = 0
    for data, target in loader:
        data, target = data.to(device), target.to(device)
        data = data.view(data.size(0), -1)
        output = model(data)
        _, predicted = output.max(1)       # 取概率最大的類別
        total += target.size(0)
        correct += predicted.eq(target).sum().item()
    return correct / total

print(f"準確率: {evaluate(model, test_loader):.2%}")
```

## 保存與加載

```python
# 保存（推薦保存 state_dict）
torch.save(model.state_dict(), 'model.pth')
# 保存 checkpoint（含優化器狀態，方便斷點續訓）
torch.save({
    'epoch': epoch,
    'model_state_dict': model.state_dict(),
    'optimizer_state_dict': optimizer.state_dict(),
    'loss': loss,
}, 'checkpoint.pth')

# 加載
model = SimpleNet(784, 256, 10)
model.load_state_dict(torch.load('model.pth'))
model.eval()  # 推理模式
```

## 常見問題排查

```python
# 維度不匹配：打印每層 shape
print(x.shape)

# GPU 顯存溢出
torch.cuda.empty_cache()
# 減小 batch_size 或用梯度累積

# 梯度爆炸/消失
# 打印梯度範數
total_norm = 0
for p in model.parameters():
    if p.grad is not None:
        total_norm += p.grad.norm().item() ** 2
print(f"Gradient norm: {total_norm**0.5:.4f}")
# > 10 可能爆炸，< 1e-6 可能消失

# 過擬合
# 加 Dropout、數據增強、weight decay、早停
```

## 學習路線

| 階段 | 內容 | 預計時間 |
|------|------|----------|
| 入門 | 張量運算 + 自動求導 | 1 天 |
| 基礎 | 自己寫 MLP + 訓練循環 | 2 天 |
| 進階 | CNN/LSTM/Transformer + 數據加載 | 1 周 |
| 實戰 | 復現一篇論文的代碼 | 1-2 周 |
| 進階 | torch.compile / FSDP / 混合精度 | 邊用邊學 |

## 常用速查

| 操作 | 代碼 |
|------|------|
| 張量創建 | `torch.randn(n, m)` |
| GPU 遷移 | `x.to('cuda')` |
| 矩陣乘法 | `x @ y.T` |
| 自動求導 | `loss.backward()` |
| 定義模型 | `class Net(nn.Module):` |
| 損失函數 | `nn.CrossEntropyLoss()` |
| 優化器 | `optim.Adam(model.parameters(), lr=1e-3)` |
| 數據加載 | `DataLoader(dataset, batch_size, shuffle)` |
| 推理模式 | `@torch.no_grad()` |
| 保存參數 | `torch.save(model.state_dict(), path)` |
