---
title: "How this portfolio is built"
description: "A short overview of the technology and content structure behind this website."
date: "2026-11-10"
category: "Web Development"
tags: ["Next.js", "Static Export", "GitHub Pages"]
published: true
---

This website is a static Next.js site. It is built into plain HTML, CSS and JavaScript files and hosted on GitHub Pages, so it does not need a server.

## Where content lives

Most of the site is driven by data files in `src/data`. Projects, skills, journey entries, research records and resources each have their own file. Blog articles are Markdown files in `content/blog`, one file per article.

Each article begins with a short block of details called frontmatter: the title, a description, the date, a category, tags and a `published` flag. Articles with `published` set to anything other than `true` are not shown on the site.

## Why Markdown without a library

The article renderer supports the Markdown features needed for technical writing: headings, lists, code blocks, quotes, links and emphasis. It creates React elements directly instead of inserting HTML, so an article cannot inject markup into the page.

Images and tables are not yet supported. Adding them would mean extending the renderer, which is a deliberate choice to keep dependencies small.
