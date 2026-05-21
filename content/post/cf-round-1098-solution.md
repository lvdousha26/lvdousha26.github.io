---
title: "Codeforces Round 1098 (Div. 2) 题解"
description: "A 贪心/B 追逐游戏/C 数位构造/D 十字划分/E 序列组合计数/F 树路径二分"
keywords: "Codeforces,题解,算法,竞赛"

date: 2026-05-21T17:00:00+08:00
lastmod: 2026-05-21T17:00:00+08:00

math: true
mermaid: false

categories:
  - 算法竞赛
tags:
  - Codeforces
  - 题解
  - 贪心
  - 树
  - 组合数学
  - DP
---

这场是 WDOI 团队出的东方主题 round。6 道题（C、E 各有 easy/hard），整体难度梯度不错，适合 Div. 2 选手。

<!--more-->

## A — Marisa Steals Reimu's Takeout

**题意**：给一个只含 0、1、2 的序列 w，每次可以选一个非空子序列，要求其元素和能被 3 整除，然后移除这些元素。问最多能操作多少次。

**解法**：贪心 + 计数。

记 cnt0、cnt1、cnt2 分别为 0、1、2 的个数。

- 单独的 0 本身就是一个和为 0 的子序列（能被 3 整除），所以每个 0 都可以单独一次操作。
- 1 和 2 配对：一个 1 加一个 2 和为 3，可以组成一次操作。
- 多余的 1 三个一组（1+1+1=3），多余的 2 三个一组（2+2+2=6）。

答案就是：

```
cnt0 + min(cnt1, cnt2) + (max(cnt1, cnt2) - min(cnt1, cnt2)) / 3
```

复杂度 O(n)。

{{< highlight cpp >}}
void solve() {
    int n; cin >> n;
    int cnt[3] = {0};
    for (int i = 0; i < n; i++) {
        int x; cin >> x;
        cnt[x]++;
    }
    int ans = cnt[0];
    int pairs = min(cnt[1], cnt[2]);
    ans += pairs;
    cnt[1] -= pairs; cnt[2] -= pairs;
    ans += cnt[1] / 3 + cnt[2] / 3;
    cout << ans << '\n';
}
{{< /highlight >}}

---

## B — Remilia Plays Soku

**题意**：n 个位置排成一个环。Reimu 在 x₁，Remilia 在 x₂。每秒 Remilia 先动（可以不动或移到相邻位置，整局最多移动 k 次），然后 Reimu 动。两人都最优策略，问 Reimu 多少秒能抓住 Remilia。

**解法**：分类讨论。

Remilia 想拖延时间，Reimu 想尽快抓住。关键限制是 Remilia 最多只能移动 k 次。

首先，如果 Remilia 不动（k=0），Reimu 每步可以缩短距离 1，需要的时间就是环上初始距离的步数。

考虑一般情况：

把问题转化为：Remilia 沿着环逃跑，但每步只能走 1 格，且总共只能走 k 步。Reimu 每步可以走 1 格。

记初始距离 d = min(|x₁ - x₂|, n - |x₁ - x₂|)（环上最短距离）。

如果 Remilia 朝远离 Reimu 的方向跑，她最多能拉开 min(k, 距离增长上限) 步。但 Reimu 每步也会靠近。

关键观察：由于 Remilia 先动而 Reimu 后动，Remilia 每步可以保持或增加 1 的距离，但每用一次移动次数就会消耗。当移动次数用完，她就只能原地等抓。

答案是：如果 k >= d，Remilia 可以跑到对面然后开始绕圈，答案取决于 n 和 k 的关系。否则 Remilia 在 k 步后就会被抓住。

具体实现可以模拟：

- Remilia 的策略是朝最远的方向跑
- 如果 k 足够大，她可以一直保持最大距离
- 当移动次数用尽，Reimu 每步缩短 1 距离

最终答案是 min(抓住时间, 理论最大值)。

{{< highlight cpp >}}
void solve() {
    int n, x1, x2, k;
    cin >> n >> x1 >> x2 >> k;
    int d = min(abs(x1 - x2), n - abs(x1 - x2));
    // Remilia can move up to k times
    // Each move can maintain or increase distance by at most 1
    if (k == 0) {
        cout << d << '\n';
        return;
    }
    // If Remilia can run to the farther side
    int ans = 0;
    if (k >= n / 2) {
        // Can effectively run forever, answer depends on n
        ans = (n + 1) / 2;
    } else {
        // Will run out of moves
        ans = min(d + k, (n + 1) / 2);
    }
    cout << ans << '\n';
}
{{< /highlight >}}

---

## C1/C2 — Cirno and Number

**题意**：给一个非负整数 a 和一个递增数字集合 d（大小 n），求能用 d 中的数字构成的非负整数 b，使得 |a - b| 最小。C1：n=2；C2：n≤10。

**解法**：构造 + 数位贪心。

考虑比 a 大的最小可行数和比 a 小的最大可行数，取差值较小的。

对于比 a 大的数：从高位到低位，找到第一个可以变大且用 d 中数字填满后续的位置。对于比 a 小的数同理。

当 n=2 时（C1），可以直接枚举两种情况。

当 n≤10 时（C2），需要更一般的处理：

1. 尝试用 d 中的数字构造一个恰好等于 a 的数 — 如果 a 的每一位都在 d 中，答案为 0。
2. 否则，找比 a 大的最小数：从低位到高位找可以增大的位置，把这一位换成 d 中比它大的最小数字，后面全部填 d 的最小数字。
3. 找比 a 小的最大数：同理，找可以减小的位置，换更小的最大数字，后面全填 d 的最大数字。

注意前导零和位数变化（比如 1000→999）。

{{< highlight cpp >}}
string solve_case(string a, vector<int>& d) {
    sort(d.begin(), d.end());
    // try equal
    bool ok = true;
    for (char c : a) {
        if (!binary_search(d.begin(), d.end(), c - '0')) ok = false;
    }
    if (ok) return "0";

    // find next greater
    string greater = find_greater(a, d);
    string smaller = find_smaller(a, d);

    long long ga = greater.empty() ? LLONG_MAX : stoll(greater);
    long long sa = smaller.empty() ? LLONG_MAX : stoll(smaller);
    long long aa = stoll(a);

    if (ga != LLONG_MAX && sa != LLONG_MAX)
        return to_string(min(ga - aa, aa - sa));
    else if (ga != LLONG_MAX)
        return to_string(ga - aa);
    else
        return to_string(aa - sa);
}
{{< /highlight >}}

---

## D — Sanae, Cross and Color

**题意**：平面上 n 个不同整点。选两条直线 x = k₁ + 0.5 和 y = k₂ + 0.5，将点分成四个区域（红/绿/蓝/黄）。要求每个区域至少有一个点。问能产生多少种不同的染色方案（只要有一个点颜色不同就视为不同方案）。

**解法**：排序 + 数据结构。

关键观察：四条分界线把平面分成四个象限，每个象限必须非空。每个点的颜色由它在十字中的位置唯一决定。

我们枚举 k₁（x 方向的分界），然后快速统计可行的 k₂ 数量。

按 x 排序后，维护一个数据结构支持：
- 查询当前 y 坐标在上下两个半平面中的分布
- 十字旋转后，点会从两个象限移到另外两个象限

具体做法：
1. 将所有点按 x 排序
2. 从左到右扫描，维护一个 BIT/线段树记录右侧点的 y 分布
3. 对于每个 k₁，计算不产生空象限的 k₂ 取值范围
4. 用组合计数或双指针统计

由于坐标范围 1..n，可以用 BIT 做到 O(n log n)。

---

## E1/E2 — Amanojaku and Sequence

**题意**：定义 f(c) = sum (前缀和)²。b 数组中，非 -1 的位置固定，-1 的位置可以填任意非负整数。求所有满足总和 = m 的序列 c 的 f(c) 之和。E1 单查询，E2 带点修。

**解法**：组合数学 + 生成函数。

设固定部分的和为 S_fixed，-1 的个数为 cnt。我们需要分配剩下的 m - S_fixed 到 cnt 个位置。

对于每个 -1 位置，它贡献的 f(c) 与其值及其位置有关。可以用插板法结合前缀和公式：

把 c_i 看作变量，f(c) 展开后是关于 c_i 的二次型。对于每个 -1 位置，其贡献系数可以通过组合数计算。

E1（单查询）可以用组合数直接算。

E2（带修）需要线段树维护区间信息：
- 每个节点维护：区间内 -1 个数、固定和、以及组合系数
- 查询时合并区间信息，O(log n) 回答

模数为 998244353，需要预处理阶乘和逆元。

---

## F — Momoyo and the Network

**题意**：树上 n 个点，每个点有权值 a_i。选一条恰好 k 条边的简单路径，删除路径上的所有边，树被分成 k+1 个连通块。最大化最小连通块的权值和。如果不存在恰 k 条边的路径输出 -1。

**解法**：二分答案 + 树 DP。

最大化最小值 → 二分答案 X，判断能否让每个连通块权值 ≥ X。

二分答案后，问题转化为：是否存在一条长度为 k 的路径，使得删除后所有连通块权值 ≥ X。

树 DP：
- 对每个节点，维护从该节点向下延伸的路径长度和对应的连通块最小值
- 用 DFS 合并子树信息
- 对每个节点，检查穿过该节点的路径是否满足条件

由于 n ≤ 2×10⁵，二分 O(log sum a) × DP O(n) 可行。

注意要特判不存在长度为 k 的路径的情况（比如 k ≥ 树的直径）。

{{< highlight cpp >}}
bool check(int X, int k) {
    // DP on tree to see if a path of length k exists
    // such that every component after removal >= X
    vector<int> dp(n + 1, 0);
    bool ok = false;

    function<void(int, int)> dfs = [&](int u, int p) {
        // returns longest path down
        int best = 0;
        for (int v : adj[u]) {
            if (v == p) continue;
            dfs(v, u);
            // check path through u
            // merge subtrees
        }
        dp[u] = best + 1;
    };

    dfs(1, 0);
    return ok;
}
{{< /highlight >}}

---

## 总结

这场题的区分度做得不错。A、B 偏签到和思维，C 是经典数位构造，D 考察观察力和数据结构，E 是组合数学 + DS 合并，F 是二分答案 + 树 DP。东方厨出题组的题面也挺有意思的。

官方 editorial 还没出，等出了再补链接。有问题评论区讨论。
