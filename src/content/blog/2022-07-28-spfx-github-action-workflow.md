---
title: 'spfx-github-action-workflow'
description: 'Sample GitHub Actions for building SharePoint Framework (SPFx) packages.'
pubDate: 2022-07-28
tags: ['project', 'spfx', 'github']
---

This repository has a couple sample GitHub ACtions for building SharePoint Framework (SPFx) packages.

[Check out the repository on GitHub](https://github.com/cwparsons/spfx-github-action-workflow/tree/main/.github/workflows).

## build-package.yml

```yml
name: Build and package

on:
  workflow_call:
    inputs:
      zipped-package:
        description: Path to sppkg file
        required: false
        type: string

jobs:
  build:
    name: Build and package
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version-file: 'package.json'
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Compile source code
        run: npx gulp bundle --ship

      - name: Create SharePoint Framework package
        run: npx gulp package-solution --ship

      - name: Upload SharePoint Framework package
        uses: actions/upload-artifact@v4
        if: ${{ inputs.zipped-package != '' }}
        with:
          name: package
          path: sharepoint/${{ inputs.zipped-package }}
```

## ci.yml

A workflow that runs on all code pushes to main, feature and hotfix branches. This workflow is to help quickly identify changes that prevent building and packaging our SharePoint Framework project.

```yml
name: Continuous integration

on:
  push:
    branches:
      - 'main'
      - 'feature/*'
      - 'hotfix/*'

jobs:
  build:
    name: CI build
    uses: ./.github/workflows/build-package.yml
```

## release.yml

A workflow that runs on commits that are tagged with a version (v\*). This will attempt to build and package the SharePoint Framework package, and then create a draft GitHub release. The package will be attached to the release.

```yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  setup:
    name: Get package configuration
    runs-on: ubuntu-latest
    outputs:
      package: ${{ steps.set-package.outputs.package }}
      zipped-package: ${{ steps.set-zipped-package.outputs.zipped-package }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Get package-solution.json
        id: package-solution-json
        run: |
          echo "config<<EOF" >> $GITHUB_OUTPUT
          cat ./config/package-solution.json >> $GITHUB_OUTPUT
          echo "EOF" >> $GITHUB_OUTPUT

      - name: Output zipped-package
        id: set-zipped-package
        run: |
          echo "zipped-package=${{ fromJson(steps.package-solution-json.outputs.config).paths.zippedPackage }}" >> $GITHUB_OUTPUT

      - name: Output package
        id: set-package
        run: |
          filepath="${{ steps.set-zipped-package.outputs.zipped-package }}"
          filename=${filepath##*/}
          echo "package=$filename" >> $GITHUB_OUTPUT

  build:
    name: Release build
    needs: setup
    uses: ./.github/workflows/build-package.yml
    with:
      zipped-package: ${{ needs.setup.outputs.zipped-package }}

  release:
    name: Create GitHub release
    runs-on: ubuntu-latest
    needs: [setup, build]
    steps:
      - name: Download package
        uses: actions/download-artifact@v4
        with:
          name: package

      - name: Create release
        uses: softprops/action-gh-release@v1
        if: startsWith(github.ref, 'refs/tags/')
        with:
          draft: true
          files: ${{ needs.setup.outputs.package }}
          prerelease: true
```
