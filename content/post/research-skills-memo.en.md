---
title: "Research Grunt's Memo"
description: "Reading papers, running experiments, writing articles, and presenting at meetings — small but important things easily forgotten in daily research life"
keywords: "research,paper,experiment,academic,memo"

date: 2026-05-20T00:00:00+08:00
lastmod: 2026-05-20T00:00:00+08:00

math: false
mermaid: false

categories:
  - Misc
tags:
  - Research
  - Paper
  - Academic
---

This is not a serious experience post. It's just a collection of easy-to-miss pitfalls, frequently forgotten but important habits. Quick notes, continuously updated.

<!--more-->

## Reading Papers

**One paper a day? Don't buy it.** Reading one paper thoroughly per week is far more useful than skimming ten in a day. While reading, ask yourself: What problem did they solve? Why does the method work? Can I reproduce it?

**Three passes are enough.** First pass: title + abstract + glance at figures, decide whether to read. Second pass: go through the main text, follow the reasoning. Third pass: follow the references to trace the lineage.

**Take notes after reading.** Add a Note in Zotero or write a paragraph in Obsidian. If you don't take notes, you might as well not have read — three months later you won't even remember what the paper was about.

**Don't only read the latest.** Classic papers (the ones with thousands of citations) are worth ten ordinary ones. They define the problem framework of the field.

## Running Experiments

**Start a log before every experiment.** The simplest approach: create an `experiments.md` in your project directory, recording dates, parameters, results, and ideas for improvement. Pen and paper work too. In two weeks, you won't remember why that `lr=3e-4 bs=32 warmup=500` run performed well.

**Change only one variable at a time.** When tuning hyperparameters, don't change lr and batch_size simultaneously — you won't know which one made the difference.

**Fix your random seed.** `torch.manual_seed(42)` is just one line; without it, you'll never reproduce that SOTA result again.

**Get the baseline working first.** Don't jump straight to your fancy method. First, get the simplest version running (even random guessing), and confirm your pipeline has no bugs.

**Save checkpoints frequently.** Storage is cheap, time is expensive. Save one per epoch, with step and metric in the filename.

## Writing Code

**Notebooks are for exploration, not delivery.** Once you've iterated enough, extract the code into `.py` files. The execution order of notebook cells is a hidden time bomb.

**Git: don't just use master.** One branch per experiment. If it breaks, no big deal — delete it and start over.

**Record your dependencies.** `pip freeze > requirements.txt` or `conda env export > environment.yml`. When others run your code, their environment will be worlds apart from yours.

## Writing Papers

**Build the skeleton before filling in the flesh.** Don't start with the abstract. First list section titles and bullet points for each paragraph — get the story straight first.

**Figures first.** Reviewers look at figures first. Each figure should have a take-home message (the most important information in the figure).

**Introduction logic chain:** Broad context → specific problem → prior work → their limitations → our solution → contributions. Fill in this template.

**Related work: don't write a laundry list.** Each citation should explain its relationship to your work — is it inspiration? A baseline? A pain point you're solving?

**Let it sit for two days before re-reading.** Right after writing, it looks perfect. Come back two days later, and you'll find plenty of rough spots.

**A LaTeX tip:** For long documents, use `\input{}` to split each section into a separate `.tex` file. You can edit one section without recompiling the entire document.

## PPTs / Presentations

**The 3-minute theorem:** Listeners' attention spans last three minutes at most. Each slide must be understood within 20 seconds, or it's too complex.

**Tell a story, don't read a log.** motivation → problem → method → key insight → result → takeaway. Each step must answer "why."

**Pictures >> words.** If a slide has more than 50 words, it's time to split it up.

**Practice once in advance.** Give the talk to an empty room or grab a classmate — you'll immediately see which parts are unclear.

## Daily Habits

**Backup.** Code on GitHub, papers on Zotero, notes on Obsidian, data on Nutstore/OneDrive with auto-sync. You only need to lose data once to learn.

**Take notes.** Spend five minutes after every meeting writing down discussion points and to-dos. Trust me, if you don't, you'll forget by the time you finish lunch.

**Don't compare.** Your labmate published at a top conference, your neighbor got an offer — that has nothing to do with you. Research is a marathon; everyone has their own pace.

**Ask questions.** If you're stuck on something for two days, just ask. The time you're stuck is enough to ask three people.

**Rest.** You can't make good research decisions when physically exhausted. Sleep when you're tired — a clear mind after rest is far more productive than grinding two extra hours.

## Tool List

| Scenario | Recommendation |
|----------|---------------|
| Literature Management | Zotero |
| Note-taking | Obsidian / Notion |
| Diagramming | draw.io / Figma |
| Paper Writing | LaTeX (Overleaf or local) |
| Experiment Tracking | MLflow / WandB / plain `experiments.md` |
| Time Management | Calendar is enough, don't over-invest in tools |
| English Polishing | DeepL Write / ChatGPT |
| Neural Network Diagrams | draw.io / NN-SVG |

This memo will keep being updated. I'll add more as I stumble into new pitfalls.
