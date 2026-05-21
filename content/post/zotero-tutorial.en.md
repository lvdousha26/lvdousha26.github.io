---
title: "Zotero for Reference Management: The Plugins Are the Real Deal"
description: "Zotero setup, importing references, WebDAV sync with Nutstore, and essential plugins like Better BibTeX, Translate, and Style"
keywords: "zotero,reference management,paper,plugins,tutorial"

date: 2026-05-20T00:00:00+08:00
lastmod: 2026-05-20T00:00:00+08:00

math: false
mermaid: false

categories:
  - Tutorial
tags:
  - Zotero
  - Reference Management
  - Paper
  - Tutorial
  - Tools
---

Zotero by itself is just a reference database. What makes it truly useful are the plugins. This post covers the basics, then focuses on how to install plugins, which ones are worth it, and how to configure them.

<!--more-->

## Installation

```bash
# macOS
brew install --cask zotero

# Windows
winget install Zotero.Zotero

# Or download from the official site: https://www.zotero.org/
```

Also install the browser extension **Zotero Connector** (available for Chrome / Firefox) to grab paper metadata and PDFs in one click.

## Basic Operations

### Importing References

Open a paper page in your browser (arXiv, IEEE, ACM, Google Scholar, etc.), click the Zotero Connector icon. The entry and PDF are saved to your currently selected collection.

Drag a local PDF into the Zotero window, right-click &rarr; Retrieve Metadata. Most English papers can be auto-identified.

### Organization

Create folder collections on the left. The same paper can belong to multiple collections (Zotero's "Collection" is essentially a tag, not a directory).

### Citations

After installing Zotero, a Zotero tab will appear in Word automatically. When writing:

```
Place cursor at citation position &rarr; Add/Edit Citation &rarr; Search paper title &rarr; Select format &rarr; Insert
```

After writing, use `Add/Edit Bibliography` to generate the reference list in one click. Switch formats anytime (IEEE &rarr; APA &rarr; GB/T 7714).

For LaTeX users, install the Better BibTeX plugin and export a `.bib` file:

```
Right-click paper &rarr; Export Items &rarr; Better BibTeX &rarr; Generate .bib
```

## Sync & Storage

Zotero comes with 300MB of free space, enough for entries but definitely not for PDFs.

Use Nutstore (坚果云) WebDAV to sync PDFs:

1. Nutstore &rarr; Account Info &rarr; Third-party App Management &rarr; Add App (get WebDAV address and password)
2. Zotero &rarr; Edit &rarr; Preferences &rarr; Sync &rarr; File Sync
3. Select WebDAV, enter `https://dav.jianguoyun.com/dav/`, your account, and password

300MB Zotero space + Nutstore storage = cross-platform sync, read papers on your phone too.

## Plugins &mdash; This Is the Real Content

Plugin installation: Zotero &rarr; Tools &rarr; Plugins &rarr; Gear icon (top right) &rarr; Install Plugin From File (drag the `.xpi` file in).

### Better BibTeX

Essential for LaTeX users. Generates stable citation keys for each paper (they won't change when you modify the entry), auto-exports `.bib`.

After installation, find Better BibTeX in Zotero preferences:

```
Citation Key format: auth.lower + year
Example: vaswani2017attention

Export: Preferences &rarr; Better BibTeX &rarr; Automatic Export
Set the auto-export path, `.bib` updates automatically when references change
```

### Zotero Translate

In-line translation supporting a dozen engines including Google, DeepL, and Caiyun. Select text when reading English papers and a translation pops up automatically.

After installation, right-click the Translate icon and select DeepL in settings (free quota is sufficient).

### Jasminum

Chinese paper enhancement. Automatically fetches Chinese metadata from CNKI/Wanfang, splits author names, identifies theses.

### Zotero Style

Custom display styling. Make entry lists show more columns, use a more compact font, add journal name color tags. Configure in preferences after installation.

### ZotFile

Rename and move PDF files, supports extracting annotations from PDFs. Set rules to auto-rename all PDFs to `Author_Year_Title.pdf`.

### Zotero Tag

Auto-tag papers for easier filtering by topic. Often used alongside Jasminum.

### GreenFrog / Zotero Night

Dark mode. Easier on the eyes when reading papers at night.

### Plugin Installation Priority

```
Must-have: Better BibTeX, Zotero Translate, Jasminum
Recommended: Zotero Style, ZotFile
Optional: Zotero Tag, Zotero Night
```

## Integration with Obsidian

Obsidian &rarr; Community Plugins &rarr; Search for Zotero Integration.

Once installed, in your notes:

```
Ctrl+P &rarr; Zotero Integration: Insert Literature Note
Search paper title &rarr; Auto-generate a note with metadata and link
```

## Quick Reference

| Action | Method |
|--------|--------|
| Grab paper | Click Zotero Connector icon in browser |
| Chinese paper recognition | Install Jasminum plugin |
| LaTeX bib export | Better BibTeX &rarr; Export |
| PDF sync | Nutstore WebDAV |
| In-line translation | Zotero Translate |
| Word citation | Zotero tab &rarr; Add/Edit Citation |
| Dark mode | GreenFrog plugin |
