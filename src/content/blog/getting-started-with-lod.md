---
title: "Getting Started with LOD Expressions in Tableau"
date: 2026-02-12
author: "Divya Nair"
tags: ["Tableau Desktop", "Calculations", "Beginner"]
category: "Tableau Desktop"
excerpt: "FIXED, INCLUDE, and EXCLUDE demystified — a practical first look at Level of Detail expressions and when to reach for each one."
cover: /images/blog/lod-expressions.jpg
draft: false
---

Level of Detail (LOD) expressions are one of Tableau's most powerful features —
and one of the most intimidating for newcomers. They let you compute aggregations
at a level of granularity independent of the view, which unlocks a whole class of
analyses that are awkward or impossible with regular calculated fields.

## The three keywords

- **FIXED** computes a value using only the dimensions you specify, ignoring the
  filters and dimensions in the view.
- **INCLUDE** adds dimensions to whatever is already in the view before aggregating.
- **EXCLUDE** removes dimensions from the view-level aggregation.

## A practical example

Say you want each customer's *first order date* shown alongside every order row:

```
{ FIXED [Customer ID] : MIN([Order Date]) }
```

Because the expression is FIXED on `Customer ID`, it returns the same earliest
date for every row belonging to that customer — regardless of what else is on the
view.

## When to use which

Start with FIXED when you need a stable value that should not shift as users
filter. Reach for INCLUDE when you want finer granularity than the view, and
EXCLUDE when you want a coarser benchmark (like a category average) next to row
level detail.

Bring your questions to the next BTUG meet-up — we love working through real LOD
puzzles together.
