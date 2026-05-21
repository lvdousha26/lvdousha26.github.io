---
title: "How to Read Academic Papers: A Beginner's Guide for Undergraduates"
description: "From selecting papers to taking notes, a practical reading method for undergraduates to tackle thesis work and research入门"
keywords: "paper reading,literature,undergraduate,academic,tutorial"

date: 2026-05-19T00:00:00+08:00
lastmod: 2026-05-19T00:00:00+08:00

math: false
mermaid: false

categories:
  - Tutorial
tags:
  - Paper
  - Academic
  - Tutorial
---

## Why Undergraduates Should Read Papers Too

Three most common scenarios:

1. **Graduation thesis** — Your advisor gives you a direction, but you have to find the methods yourself; textbooks won't cover them
2. **Course projects** — You need to understand the SOTA solutions for a given problem
3. **Deciding whether to pursue graduate studies** — Read a few papers in your target field to see if you're genuinely interested

The core goal of reading papers as an undergraduate is not to chase novel contributions, but to **understand what others have done and why they did it that way**.

<!--more-->

## Mental Preparation Before You Start

The first time you read an English paper, you'll likely spend half an hour on a single page, struggling with unfamiliar vocabulary and incomprehensible equations. **This is completely normal.**

A few facts:
- Nobody is born knowing how to read papers; it's a skill built through practice
- Out of a 10-page paper, the parts you actually need to read word-for-word amount to no more than 3 pages
- Most papers aren't worth reading thoroughly; learning to filter is more important than learning to read
- Reading 3 papers with a rough understanding beats slogging through 1 paper with perfect comprehension

## Step 1: Know What to Look For

### Awesome Lists on GitHub Are the Best Starting Point

```bash
# Search "awesome" + your field
awesome deep learning
awesome computer vision
awesome nlp
```

Awesome lists curate surveys, classic papers, tools, and tutorials for your field — far more efficient than blindly searching databases.

### Start with Chinese Resources First

| Resource | Best For |
|----------|----------|
| Zhihu search: "xxx field paper recommendations" | Quickly understanding the landscape |
| Bilibili paper walkthrough videos | Following along with core papers |
| Chinese surveys (CNKI) | Building a panorama of the field |
| WeChat tech articles | Fragmented supplementary reading |
| GitHub paper lists + code | Reproduction and practice |

First grasp the basic concepts and problem definitions through Chinese resources, then read English papers — your efficiency will double.

### Where to Search for Papers

```
Google Scholar    — Most versatile, search titles + PDF links
Semantic Scholar  — AI-assisted, shows citations and impact
Connected Papers  — Input a paper, visualize citation relationships
arXiv             — Preprints, the latest papers live here
DBLP              — CS field, search by author/conference
```

## Step 2: Quick Filtering

As an undergraduate, you don't need to read dozens of papers. Selecting 5-8 truly useful ones is enough.

### Priority Ranking

| Priority | Type | Description |
|----------|------|-------------|
| 1 | **Chinese surveys** | First understand what this field is about |
| 2 | **Classic papers** (1000+ citations) | The foundation of the field; methods originate from these |
| 3 | **Papers with open-source code** | Running the code deepens understanding |
| 4 | **Recent surveys (last 2 years)** | Understand current progress |
| 5 | **Latest SOTA** | If you want to make improvements yourself |

### Judging Whether a Paper Is Worth Reading

Check these four things and decide within one minute:

1. **Title and abstract** — What problem does it solve?
2. **Figures and tables** — Method framework diagram + result comparison table
3. **Last paragraph of the conclusion** — How do the authors summarize their contribution?
4. **GitHub link** — Is there code available?

If after checking these four points you still can't tell what the paper did, the paper is probably poorly written — move on to another one.

## Step 3: The Three-Pass Approach

Adapted from S. Keshav's classic method, simplified for undergraduates:

### First Pass: Figure Out What Was Done (10-15 minutes)

- Title, abstract
- First and last paragraphs of the introduction
- Section headings (skip mathematical derivations)
- All figures and tables
- Conclusion

After this pass, you should be able to answer: **What problem does this paper solve? What method does it use? How good are the results?**

Most papers can stop here. For undergraduates, the information from the first pass is already sufficient for writing a course survey or understanding a new direction.

### Second Pass: Understand How It Was Done (30-60 minutes)

Only apply this pass to the 3-5 core papers you've selected.

- Read the full text, but skip overly complex mathematical derivations
- Carefully examine the flowcharts and pseudocode in the methods section
- Look at the experimental setup and result comparisons
- Annotate key points in the margins

After this pass, you should be able to verbally explain the paper's method flow to a classmate.

### Third Pass: Dive into Details (Optional, for only the 1 paper you most want to reproduce)

- Read the methods section line by line, deriving key formulas
- Compare every setting in the experiments
- Run the authors' open-source code
- Think: What are the shortcomings of this method? Where could I start if I wanted to improve it?

For undergraduates, most papers don't need a third pass. At most 1-2 papers related to your thesis require this depth.

## Step 4: Take Notes

If you don't take notes after reading, you might as well not have read. No need to overcomplicate things.

### The Minimal Note-Taking Method

One paragraph per paper is enough:

```markdown
# AlphaFold (Jumper et al., 2021, Nature)

## One-liner
Uses deep learning to predict protein 3D structure from amino acid sequences, with accuracy approaching experimental methods.

## Core Method
Input sequence → Evoformer (MSA + residue pair representation) → Structure Module → 3D coordinates

## Key Results
Median GDT of 92.4 on CASP14, within 1A of experimental structures.

## My Takeaways
- Using multiple sequence alignment (MSA) to incorporate evolutionary information is clever
- End-to-end training rather than a stepwise pipeline
```

### Tool Selection

| Tool | Best For |
|------|----------|
| **Notion** | Structured organization, build a paper database |
| **Obsidian** | Bidirectional linking, cross-referencing papers |
| **Typora / VS Code** | Pure Markdown, keep it simple |
| **Yuque / Feishu Docs** | Sharing notes with classmates |
| **Handwritten notebook** | Most helpful for formula derivation |

Don't agonize over tools. A sheet of A4 paper and a pen are enough to start.

## Step 5:辅助工具

### Struggling with English? Don't Tough It Out

```bash
# Translation tools
DeepL            # More accurate than Google Translate, good for full paragraphs
Immersive Translation Plugin # Browser plugin, original on left, translation on right
ChatGPT/Claude   # Paste a paragraph and ask: "Explain this in Chinese"
```

**But note**: Translation is just a crutch. Core terminology and key methods must be understood in English — otherwise, writing your own paper will be painful.

### Can't Understand the Math Formulas?

1. First read the text descriptions; most formulas have textual explanations
2. Ask ChatGPT about symbols you don't understand: "What does each symbol in this formula mean?"
3. Find papers with code; code is easier to understand than formulas
4. Similar papers use similar formulas; familiarity comes with exposure

## Reading Suggestions for Each Undergraduate Stage

| Stage | Goal | Advice |
|------|------|--------|
| **Freshman/Sophomore** | Cultivate interest | Read tech blogs and科普 articles; occasionally skim paper figures |
| **Summer after sophomore year** | Research入门 | 1 Chinese survey + 2-3 classic papers (second pass) |
| **Junior year fall** | Choose direction | 1 English survey + 5-8 classic papers |
| **Junior year spring / Thesis** | Go deep | Close-read 3-5 core papers + reproduce 1-2 papers' code |
| **Senior year** | Graduate school transition | Browse arXiv for new papers + speed-read 2-3 papers per week |

## Common Mistakes

| Wrong Approach | Right Approach |
|---------------|----------------|
| Word-for-word from page 1 | Three-pass filtering; stop most papers at first pass |
| Banging your head against one paper for a week | Switch to another paper in the same direction; maybe this one is just poorly written |
| Read without taking notes | Write a summary paragraph immediately after reading |
| Afraid of English | Read Chinese resources first, then use translation aids for English |
| Hoard without reading | Set a fixed weekly reading time, even if only finishing the first pass |
| Pursuing perfect comprehension | 60% understanding is enough; reading more papers will connect the dots naturally |
| Never touching code | Always run the code if it's open-source |

## Summary

The core mindset for undergraduates reading papers: **Don't treat reading papers like an exam; treat it like exploration.**

Not understanding is normal. Read a few more and things will naturally click. You're not fighting against the paper — you're using it to help yourself understand something. What you can't grasp today might make sense next week, because of the积累 you've built up in between.
