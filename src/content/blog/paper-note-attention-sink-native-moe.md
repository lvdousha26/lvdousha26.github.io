---
title: "论文阅读笔记：Attention Sink 与注意力层里的原生 MoE"
description: "ICML 2026：把 sink 的注意力权重看成门控，注意力头就成了专家，注意力层本就是 MoE；由此解释 head collapse 并用负载均衡损失缓解"
publishDate: 2026-09-22T21:00:00+08:00
tags:
  - "Paper Notes"
  - "LLM"
  - "Attention"
  - "MoE"
  - "ICML"
---

## 论文信息

- 标题：Attention Sink Forges Native MoE in Attention Layers: Sink-Aware Training to Address Head Collapse
- 作者：Zizhuo Fu, Wenxuan Zeng, Runsheng Wang, Meng Li（北京大学）
- 会议：ICML 2026
- 链接：<https://arxiv.org/abs/2602.01203>

## 一句话总结

以往把 attention sink 当成 softmax 归一化逼出来的“副作用”，这篇论文反过来指出：**sink 的注意力权重本身就是门控**——于是注意力头成了 experts，注意力层原本就是一个 MoE，而长期训练中出现的 head collapse 就是 MoE 里的 expert collapse。

## 1. 背景：三种注意力机制

| 机制 | 代表模型 | 做法 |
| --- | --- | --- |
| Vanilla Attention | 大多数开源模型 | 不做处理，靠第一个 token 吸收冗余注意力 |
| Sink Attention | GPT-OSS | 在 softmax 分母里加一个可学习的 `sink` 参数 |
| Gated Attention | Qwen3-Next | 每个头算一个 sigmoid 门控因子 |

softmax 的权重必须和为 1。当某个头不需要分配那么多注意力时，多出来的权重总得有地方去——模型把它倾倒给第一个 token，而第一个 token 的 value 向量在训练中会被学到接近 0（论文称之为 **value drain**，实测把首个 token 的 value 直接置零几乎不掉点）。

Sink Attention 用一个没有 value 的 `sink` 参数替掉第一个 token，Gated Attention 则干脆用显式门控。

## 2. 核心洞察：sink 就是隐式门控

这是全文最漂亮的一步。因为 sink 的 value 贡献为 0，把它从求和里摘出去后：

$$
O_t^{l,h}=\sum_{j\neq \text{sink}}A_{t,j}^{l,h}\mathbf{v}_j^{l,h}=\underbrace{(1-A_{t,\text{sink}}^{l,h})}_{G_t^{l,h}}\cdot\sum_{j\neq \text{sink}}\tilde{A}_{t,j}^{l,h}\mathbf{v}_j^{l,h}
$$

那个 $(1-A_{\text{sink}})$ 自然而然成了一个缩放因子。对照 Gated Attention 的 $G_t^{l,h}=\sigma(x_t^l W_\theta^{l,h})$，两者是一回事：

$$
G_t^{l,h}=1-A_{t,\text{sink}}^{l,h}
$$

而且这个隐式门控**天然满足** Gated Attention 的两个设计选择：它是逐头的（每个头自己算自己的 sink 权重），也是等价于 sigmoid 形式的（论文给出了 $\sigma(\cdot)$ 的改写，见第 5 节）。

> 头的输出被门控因子缩放：sink 吸走 99% 权重时，这个头基本被“关掉”；sink 权重低时才“打开”。所以注意力层同时具备了 MoE 的两个要件——独立的 expert（各注意力头）和 router（sink 导出的门控）。

## 3. 为什么去掉 sink 反而更好

既然 sink 有门控作用，为什么 Sink / Gated 还会涨点？论文的解释是 **query-key 几何被解放了**。

Vanilla Attention 里，为了维持对第一个 token 的高注意力，几何上被逼成一个两极结构：后续 token 的 query 必须挤在 $\mathbf{k}_0$ 附近，它们的 key 又必须远离 $\mathbf{k}_0$ 以免干扰 sink。结果是 query 只能在很窄的角度范围内变化，key 的有效维度也被压缩，softmax 区分候选 token 的精度随之下降。

Sink / Gated 把 sink 与语义 token 解耦后，$\mathbf{k}_0$ 不再特殊，q/k 分布重新变得多样——这才是它们在长文本上更强的真实原因，而不只是“消掉了 sink”这么表面。

## 4. Head Collapse：注意力层里的 expert collapse

已有的观察是：只有固定的一小部分头真正参与生成，`zeroing >25% 的头` 模型精度几乎不变。这和 MoE 的 expert collapse 是同一件事。

论文把它定量化了。既然有了门控，头的贡献度可以直接用平均门控值衡量：

$$
\mathrm{Imp}^{l,h}=\frac{1}{|\mathcal{T}|}\sum_{(i,t)\in\mathcal{T}}G_{i,t}^{l,h}
$$

再用各层 importance 的**变异系数**（CV）平均一下，得到头的负载不均衡度。在 LLaMA-3.1-8B、GPT-OSS-20B、Qwen3-Next-80B-A3B 上，三者的热力图都呈现同一个模式：少数头长期高亮，大量头几乎不激活。

而且这个不均衡**随训练进程加深**——早期占优的头会吸引到更多更新，进一步拉大差距，最后稳定在高位。代价很直接：名义上 32 个头，实际只有 4 个在干活，剩下的算力和参数都白花了。

## 5. 方法：Sink-Aware Training

思路照搬 MoE 的负载均衡损失，只是作用对象从 expert 换成了 head。从小到大：

**从头训练**，直接压各层 importance 的 CV：

$$
\mathcal{L}_{\mathrm{aux}}=\lambda\sum_{l=1}^{N_L}N_h\left[\mathrm{CV}\!\left(\{\mathrm{Imp}^{l,h}\}_{h=1}^{N_h}\right)\right]^{2}
$$

总损失为 $\mathcal{L}=\mathcal{L}_{\mathrm{base}}+\mathcal{L}_{\mathrm{aux}}$。

**微调已有模型**要小心：直接这么加会触发论文命名的 **head pinning effect**——已塌缩的头承载着预训练知识、门控值抗拒变化，其他头为了“追平”反而把自己的门控也抬上去，结果是大家一起高，还是不均衡。

解法借自 DeepSeek-MoE 的 shared/routed expert 设计：把每层最重要的 top-$m$ 个头设为 shared head 保持原样，只对剩下的 routed head 做均衡：

$$
\mathcal{L}_{\mathrm{aux}}=\lambda\sum_{l=1}^{N_L}(N_h-m)\left[\mathrm{CV}\!\left(\{\mathrm{Imp}^{l,h}:h\notin\mathcal{T}^{l}_{m}\}\right)\right]^{2}
$$

**工程上怎么拿到门控**是个真问题。$G=1-A_{\text{sink}}$ 需要注意力权重，而 Flash Attention 根本不物化注意力矩阵。论文的做法是用 LSE 换：

- Vanilla Attention：$G_t^{l,h}=\sigma\!\left(\mathrm{LSE}_{\neg 0}-\dfrac{\mathbf{q}_t^{l,h}{\mathbf{k}_0^{l,h}}^\top}{\sqrt{d_h}}\right)$，LSE 直接由 Flash Attention kernel 返回；
- Sink Attention：$G_t^{l,h}=\sigma(\mathrm{LSE}-\mathbf{sink})$——顺便把原先必须退回非融合实现的 Sink Attention 也塞进了 Flash Attention。

额外训练开销不到 2%。

## 6. 实验结果

**从头训练**（0.6B / 1B / 2B，三种机制 × 有无 aux 损失）。两个结论很稳：

1. Gated > Sink > Vanilla，三种规模都成立；
2. 加 aux 损失在**所有**机制、所有规模、所有指标上一致涨点，验证 BPB 一致下降。

平均分提升（base → base+aux）：

| 规模 | Vanilla | Sink | Gated |
| --- | --- | --- | --- |
| 0.6B | 39.54 → **40.82** | 40.31 → **41.11** | 40.43 → **41.35** |
| 1B | 42.59 → **43.35** | 43.27 → **43.75** | 42.69 → **43.98** |
| 2B | 45.46 → **46.83** | 46.35 → **46.50** | 46.30 → **47.70** |

**微调**（Qwen3-4B / Qwen3-8B / LLaMA3.1-8B，LoRA rank=16，$\lambda=10^{-2}$，AceReason-Nemotron 数据集）在推理和 LongBench 两组基准上都一致变好，LongBench 平均分别 51.46 → **52.75**、50.67 → **55.38**、40.51 → **43.98**——长文本是受益最大的一块，和“更好利用注意力头 = 更强的信息召回”这个解释对得上。需要注意的是 LongBench 里有个别任务（如 LLaMA3.1-8B 的 TriviaQA）反而下降，论文没有细究。

## 7. 读后杂感

**这篇和前几天那篇讲离群值的文章正好咬合。**那篇说，离群值来自召回头为了对抗 RoPE 快分量、在低频维度上放大的通道级信号；这篇则指出，sink 是注意力层的 router，并且明确提到 attention sink 会诱导激活值的极端离群值（第 3.2 节引了量化相关工作）。两条线索指向同一件事：**离群值、sink、头的分工，很可能不是三个独立现象，而是同一套路由机制的不同侧面。**如果 sink 门控就是 router，那么量化时那些“必须保住”的离群通道，或许正好对应着最活跃的那些头的门控通路——这是个可以往下挖的点。

**几点存疑：**

- 从头训练的实验最大只到 2B，aux 损失在 2B Sink 上的增益已经掉到 +0.15，能否外推到前沿规模存疑。
- $\lambda$ 怎么选、对结果有多敏感，正文没展开。
- 门控值 $1-A_{\text{sink}}$ 作为“重要性”的代理，隐含假设是 sink 之外的注意力都有效；但一个头也可能是把权重均摊到一堆无关 token 上，此时门控值高却不见得有用。

## 参考

- 论文：<https://arxiv.org/abs/2602.01203>
- StreamingLLM：<https://arxiv.org/abs/2309.17453>
- DeepSeek-MoE：<https://arxiv.org/abs/2401.06066>
- DuoAttention：<https://arxiv.org/abs/2410.10819>
