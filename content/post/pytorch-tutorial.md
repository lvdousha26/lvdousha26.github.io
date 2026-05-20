---
title: "PyTorch 入门"
description: "面向初学者的 PyTorch 实用教程，覆盖张量操作、自动求导、数据加载和模型训练"
keywords: "pytorch,深度学习,神经网络,教程"

date: 2026-05-19T00:00:00+08:00
lastmod: 2026-05-19T00:00:00+08:00

math: false
mermaid: false

categories:
  - 教程
tags:
  - PyTorch
  - 深度学习
  - 教程
  - 小工具
---

## 为什么选 PyTorch

深度学习框架分两大阵营：PyTorch（Meta）和 TensorFlow（Google）。2026 年，PyTorch 已在学术界和工业界全面领先——论文复现、顶会代码、HuggingFace 生态几乎全基于 PyTorch。

核心优势：**动态计算图**（define-by-run），调试和修改跟在写 Python 一样自然。

<!--more-->

## 安装

```bash
# CPU 版
pip install torch

# CUDA 版（有 NVIDIA 显卡）
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124

# 验证
python -c "import torch; print(torch.__version__); print(torch.cuda.is_available())"
```

## 张量：PyTorch 的基本单元

张量（Tensor）就是多维数组，和 NumPy 的 `ndarray` 几乎一样，但可以在 GPU 上运算。

```python
import torch
import numpy as np

# 创建张量
a = torch.tensor([1, 2, 3])
b = torch.zeros(3, 4)           # 全 0
c = torch.ones(2, 3)            # 全 1
d = torch.randn(3, 4)           # 标准正态分布
e = torch.arange(0, 10, 2)     # [0, 2, 4, 6, 8]

# 从 NumPy 互转
arr = np.array([1, 2, 3])
t = torch.from_numpy(arr)       # ndarray → tensor
arr2 = t.numpy()                # tensor → ndarray（仅 CPU 上有效）

# 属性
print(d.shape)      # torch.Size([3, 4])
print(d.dtype)      # torch.float32
print(d.device)     # cpu

# GPU 迁移
if torch.cuda.is_available():
    d = d.cuda()    # 或 d.to('cuda')
```

## 张量运算

```python
x = torch.randn(3, 4)
y = torch.randn(3, 4)

# 逐元素运算
z = x + y        # 加法
z = x * y        # 逐元素乘法（不是矩阵乘法）
z = torch.exp(x)

# 矩阵乘法
z = x @ y.T      # @ 是矩阵乘法
z = torch.mm(x, y.T)   # 等价写法

# 维度操作
x = torch.randn(2, 3, 4)
x = x.reshape(2, 12)        # 变形
x = x.view(-1, 12)          # 类似 reshape，但要求内存连续
x = x.squeeze()             # 去掉大小为 1 的维度
x = x.unsqueeze(0)          # 在位置 0 添加一个维度

# 索引
x[:, 0, :]                  # 类似 NumPy 切片
x[x > 0]                    # 布尔索引
torch.cat([x, y], dim=0)    # 拼接
```

## 自动求导：深度学习的魔法

```python
# 需要求导的张量设置 requires_grad=True
x = torch.tensor([2.0, 3.0], requires_grad=True)
y = x[0]**2 + x[1]**3       # y = 4 + 27 = 31

# 反向传播
y.backward()
print(x.grad)   # dy/dx = [2*x0, 3*x1^2] = [4.0, 27.0]

# 梯度清零（每次 backward 前都需要）
x.grad.zero_()
```

训练循环中的标准 pattern：

```python
# 典型训练一步
optimizer.zero_grad()   # 清零梯度
loss = model(x, y)      # 前向计算
loss.backward()         # 反向求梯度
optimizer.step()        # 更新参数
```

## 构建神经网络

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
# 打印参数量
print(f"参数量: {sum(p.numel() for p in model.parameters()):,}")
```

### 常用层速查

```python
nn.Linear(in, out)       # 全连接层
nn.Conv2d(in_c, out_c, k)# 二维卷积
nn.BatchNorm2d(c)        # 批归一化
nn.LayerNorm(dim)        # 层归一化（Transformer 标配）
nn.LSTM(in, hidden)      # LSTM 层
nn.Dropout(p)            # Dropout 正则化
nn.Embedding(vocab, dim) # 词嵌入层
```

### 激活函数

```python
F.relu(x)       # 最常用，负数归零
F.gelu(x)       # Transformer 标配
F.sigmoid(x)    # 输出 0~1，二分类
F.tanh(x)       # 输出 -1~1
F.softmax(x, dim=-1)  # 多分类概率
```

## 数据加载

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

# 通常使用 torchvision 内置数据集
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

## 完整训练循环

```python
import torch.optim as optim

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = SimpleNet(784, 256, 10).to(device)

criterion = nn.CrossEntropyLoss()    # 损失函数
optimizer = optim.Adam(model.parameters(), lr=0.001)

num_epochs = 10
for epoch in range(num_epochs):
    model.train()
    total_loss = 0
    for batch_idx, (data, target) in enumerate(train_loader):
        data, target = data.to(device), target.to(device)
        data = data.view(data.size(0), -1)  # 展平图片

        optimizer.zero_grad()
        output = model(data)
        loss = criterion(output, target)
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    print(f"Epoch {epoch+1}, Loss: {total_loss/len(train_loader):.4f}")
```

## 评估与预测

```python
@torch.no_grad()  # 关闭梯度计算，节省显存
def evaluate(model, loader):
    model.eval()
    correct = 0
    total = 0
    for data, target in loader:
        data, target = data.to(device), target.to(device)
        data = data.view(data.size(0), -1)
        output = model(data)
        _, predicted = output.max(1)       # 取概率最大的类别
        total += target.size(0)
        correct += predicted.eq(target).sum().item()
    return correct / total

print(f"准确率: {evaluate(model, test_loader):.2%}")
```

## 保存与加载

```python
# 保存（推荐保存 state_dict）
torch.save(model.state_dict(), 'model.pth')
# 保存 checkpoint（含优化器状态，方便断点续训）
torch.save({
    'epoch': epoch,
    'model_state_dict': model.state_dict(),
    'optimizer_state_dict': optimizer.state_dict(),
    'loss': loss,
}, 'checkpoint.pth')

# 加载
model = SimpleNet(784, 256, 10)
model.load_state_dict(torch.load('model.pth'))
model.eval()  # 推理模式
```

## 常见问题排查

```python
# 维度不匹配：打印每层 shape
print(x.shape)

# GPU 显存溢出
torch.cuda.empty_cache()
# 减小 batch_size 或用梯度累积

# 梯度爆炸/消失
# 打印梯度范数
total_norm = 0
for p in model.parameters():
    if p.grad is not None:
        total_norm += p.grad.norm().item() ** 2
print(f"Gradient norm: {total_norm**0.5:.4f}")
# > 10 可能爆炸，< 1e-6 可能消失

# 过拟合
# 加 Dropout、数据增强、weight decay、早停
```

## 学习路线

| 阶段 | 内容 | 预计时间 |
|------|------|----------|
| 入门 | 张量运算 + 自动求导 | 1 天 |
| 基础 | 自己写 MLP + 训练循环 | 2 天 |
| 进阶 | CNN/LSTM/Transformer + 数据加载 | 1 周 |
| 实战 | 复现一篇论文的代码 | 1-2 周 |
| 进阶 | torch.compile / FSDP / 混合精度 | 边用边学 |

## 常用速查

| 操作 | 代码 |
|------|------|
| 张量创建 | `torch.randn(n, m)` |
| GPU 迁移 | `x.to('cuda')` |
| 矩阵乘法 | `x @ y.T` |
| 自动求导 | `loss.backward()` |
| 定义模型 | `class Net(nn.Module):` |
| 损失函数 | `nn.CrossEntropyLoss()` |
| 优化器 | `optim.Adam(model.parameters(), lr=1e-3)` |
| 数据加载 | `DataLoader(dataset, batch_size, shuffle)` |
| 推理模式 | `@torch.no_grad()` |
| 保存参数 | `torch.save(model.state_dict(), path)` |
