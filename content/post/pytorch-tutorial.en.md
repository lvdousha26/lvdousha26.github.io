---
title: "Getting Started with PyTorch"
description: "A practical PyTorch tutorial for beginners, covering tensor operations, automatic differentiation, data loading, and model training"
keywords: "pytorch,deep learning,neural networks,tutorial"

date: 2026-05-19T00:00:00+08:00
lastmod: 2026-05-19T00:00:00+08:00

math: false
mermaid: false

categories:
  - Tutorial
tags:
  - PyTorch
  - Deep Learning
  - Tutorial
  - Tool
---

## Why Choose PyTorch

Deep learning frameworks fall into two main camps: PyTorch (Meta) and TensorFlow (Google). By 2026, PyTorch has taken the lead across both academia and industry — paper reproductions, top conference code, and the HuggingFace ecosystem are almost entirely based on PyTorch.

Core advantage: **Dynamic computation graphs** (define-by-run). Debugging and modifying feels as natural as writing regular Python.

<!--more-->

## Installation

```bash
# CPU version
pip install torch

# CUDA version (with NVIDIA GPU)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124

# Verify
python -c "import torch; print(torch.__version__); print(torch.cuda.is_available())"
```

## Tensors: The Basic Unit of PyTorch

A tensor is a multi-dimensional array, almost identical to NumPy's `ndarray`, but capable of running on a GPU.

```python
import torch
import numpy as np

# Creating tensors
a = torch.tensor([1, 2, 3])
b = torch.zeros(3, 4)           # all zeros
c = torch.ones(2, 3)            # all ones
d = torch.randn(3, 4)           # standard normal distribution
e = torch.arange(0, 10, 2)     # [0, 2, 4, 6, 8]

# Conversion with NumPy
arr = np.array([1, 2, 3])
t = torch.from_numpy(arr)       # ndarray -> tensor
arr2 = t.numpy()                # tensor -> ndarray (CPU only)

# Attributes
print(d.shape)      # torch.Size([3, 4])
print(d.dtype)      # torch.float32
print(d.device)     # cpu

# Moving to GPU
if torch.cuda.is_available():
    d = d.cuda()    # or d.to('cuda')
```

## Tensor Operations

```python
x = torch.randn(3, 4)
y = torch.randn(3, 4)

# Element-wise operations
z = x + y        # addition
z = x * y        # element-wise multiplication (not matrix multiplication)
z = torch.exp(x)

# Matrix multiplication
z = x @ y.T      # @ is matrix multiplication
z = torch.mm(x, y.T)   # equivalent

# Dimension operations
x = torch.randn(2, 3, 4)
x = x.reshape(2, 12)        # reshape
x = x.view(-1, 12)          # similar to reshape, but requires contiguous memory
x = x.squeeze()             # remove dimensions of size 1
x = x.unsqueeze(0)          # add a dimension at position 0

# Indexing
x[:, 0, :]                  # similar to NumPy slicing
x[x > 0]                    # boolean indexing
torch.cat([x, y], dim=0)    # concatenation
```

## Automatic Differentiation: The Magic of Deep Learning

```python
# Set requires_grad=True for tensors needing gradients
x = torch.tensor([2.0, 3.0], requires_grad=True)
y = x[0]**2 + x[1]**3       # y = 4 + 27 = 31

# Backpropagation
y.backward()
print(x.grad)   # dy/dx = [2*x0, 3*x1^2] = [4.0, 27.0]

# Zero gradients (needed before each backward pass)
x.grad.zero_()
```

The standard pattern in a training loop:

```python
# One typical training step
optimizer.zero_grad()   # zero gradients
loss = model(x, y)      # forward pass
loss.backward()         # backward pass (compute gradients)
optimizer.step()        # update parameters
```

## Building a Neural Network

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
# Print parameter count
print(f"Parameters: {sum(p.numel() for p in model.parameters()):,}")
```

### Common Layers Quick Reference

```python
nn.Linear(in, out)       # fully connected layer
nn.Conv2d(in_c, out_c, k)# 2D convolution
nn.BatchNorm2d(c)        # batch normalization
nn.LayerNorm(dim)        # layer normalization (Transformer standard)
nn.LSTM(in, hidden)      # LSTM layer
nn.Dropout(p)            # Dropout regularization
nn.Embedding(vocab, dim) # word embedding layer
```

### Activation Functions

```python
F.relu(x)       # most common, zeros out negatives
F.gelu(x)       # Transformer standard
F.sigmoid(x)    # outputs 0~1, binary classification
F.tanh(x)       # outputs -1~1
F.softmax(x, dim=-1)  # multi-class probabilities
```

## Data Loading

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

# Usually use built-in torchvision datasets
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

## Complete Training Loop

```python
import torch.optim as optim

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = SimpleNet(784, 256, 10).to(device)

criterion = nn.CrossEntropyLoss()    # loss function
optimizer = optim.Adam(model.parameters(), lr=0.001)

num_epochs = 10
for epoch in range(num_epochs):
    model.train()
    total_loss = 0
    for batch_idx, (data, target) in enumerate(train_loader):
        data, target = data.to(device), target.to(device)
        data = data.view(data.size(0), -1)  # flatten images

        optimizer.zero_grad()
        output = model(data)
        loss = criterion(output, target)
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    print(f"Epoch {epoch+1}, Loss: {total_loss/len(train_loader):.4f}")
```

## Evaluation and Prediction

```python
@torch.no_grad()  # disable gradient computation to save memory
def evaluate(model, loader):
    model.eval()
    correct = 0
    total = 0
    for data, target in loader:
        data, target = data.to(device), target.to(device)
        data = data.view(data.size(0), -1)
        output = model(data)
        _, predicted = output.max(1)       # get class with highest probability
        total += target.size(0)
        correct += predicted.eq(target).sum().item()
    return correct / total

print(f"Accuracy: {evaluate(model, test_loader):.2%}")
```

## Saving and Loading

```python
# Save (recommend saving state_dict)
torch.save(model.state_dict(), 'model.pth')
# Save checkpoint (includes optimizer state, useful for resuming training)
torch.save({
    'epoch': epoch,
    'model_state_dict': model.state_dict(),
    'optimizer_state_dict': optimizer.state_dict(),
    'loss': loss,
}, 'checkpoint.pth')

# Load
model = SimpleNet(784, 256, 10)
model.load_state_dict(torch.load('model.pth'))
model.eval()  # inference mode
```

## Common Troubleshooting

```python
# Dimension mismatch: print each layer's shape
print(x.shape)

# GPU out of memory
torch.cuda.empty_cache()
# Reduce batch_size or use gradient accumulation

# Gradient explosion / vanishing
# Print gradient norm
total_norm = 0
for p in model.parameters():
    if p.grad is not None:
        total_norm += p.grad.norm().item() ** 2
print(f"Gradient norm: {total_norm**0.5:.4f}")
# > 10 may indicate explosion, < 1e-6 may indicate vanishing

# Overfitting
# Add Dropout, data augmentation, weight decay, early stopping
```

## Learning Roadmap

| Stage | Content | Estimated Time |
|-------|---------|----------------|
| Beginner | Tensor operations + automatic differentiation | 1 day |
| Basic | Write your own MLP + training loop | 2 days |
| Intermediate | CNN / LSTM / Transformer + data loading | 1 week |
| Practice | Reproduce a paper's code | 1-2 weeks |
| Advanced | torch.compile / FSDP / mixed precision | Learn as you go |

## Quick Reference

| Operation | Code |
|-----------|------|
| Create tensor | `torch.randn(n, m)` |
| Move to GPU | `x.to('cuda')` |
| Matrix multiply | `x @ y.T` |
| Automatic differentiation | `loss.backward()` |
| Define model | `class Net(nn.Module):` |
| Loss function | `nn.CrossEntropyLoss()` |
| Optimizer | `optim.Adam(model.parameters(), lr=1e-3)` |
| Data loading | `DataLoader(dataset, batch_size, shuffle)` |
| Inference mode | `@torch.no_grad()` |
| Save parameters | `torch.save(model.state_dict(), path)` |
