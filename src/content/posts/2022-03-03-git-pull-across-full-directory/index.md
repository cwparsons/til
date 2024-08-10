---
title: 'Git pull recursively using PowerShell'
description: 'Run "git pull" recursively across a directory using PowreShell'
pubDate: 2022-03-03
tags: ['powershell']
---

This script allows me to run a `git pull` against all my local repositories every morning. Works on macOS too if PowerShell is installed.

```powershell
# Runs `git pull --rebase` on each subfolder that contains a .git folder.
Get-ChildItem -Directory -Hidden -Depth 3 -Filter .git | ForEach-Object {
    Write-Host "Pulling $($_.FullName)..."
    git --git-dir="$($_.FullName)" --work-tree="$(Split-Path $_.FullName)" pull --rebase
}
```
