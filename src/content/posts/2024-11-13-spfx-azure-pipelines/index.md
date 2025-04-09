---
title: 'spfx-azure-pipeline'
description: 'Sample Azure Pipeline for building SharePoint Framework (SPFx) packages.'
pubDate: 2024-11-13
tags: ['project', 'sharepoint-spfx', 'azure-devops']
---

A sample `azure-pipeline.yml` for building SharePoint Framework projects within Azure DevOps.

- Assumes a `.nvmrc` file in the root, defining the Node version to use.

## One package

```yml
trigger:
  batch: 'true'
  branches:
    include:
      - master

variables:
  - name: release
    value: '1'

name: $(release)$(rev:.r).0+$(Date:yyyyMMdd).$(BuildID)

pool:
  name: Azure Pipelines # Update pool name

steps:
  - checkout: self
    clean: false

  - task: DeleteFiles@1
    displayName: 'Delete files from artifacts folder'
    inputs:
      SourceFolder: '$(build.artifactstagingdirectory)'
      Contents: '**'

  - powershell: |
      git clean -xdf --exclude=node_modules/
    displayName: 'Clean up all files, except for node_modules'

  - task: NodeTool@0
    displayName: 'Use Node version from .nvmrc'
    inputs:
      versionSource: 'fromFile'
      versionFilePath: '$(build.sourcesdirectory)/.nvmrc'

  - powershell: |
      $version, $metadata = ("$(Build.BuildNumber)" -split '\+')[0, -1]
      Write-Verbose "Setting package versions to $version"

      $json = Get-Content "$(build.sourcesdirectory)/package-solution.json" -raw | ConvertFrom-Json
      $json.solution.version = "$version.0"
      $json | ConvertTo-Json -depth 32 | Set-Content "$(build.sourcesdirectory)/package-solution.json"
    displayName: 'Set package-solution.json to use Azure DevOps build number'

  - powershell: |
      npm install --loglevel=error
      npx gulp bundle --ship
      npx gulp package-solution --ship
    displayName: 'Install, build and publish packages'

  - task: CopyFiles@2
    displayName: 'Copy built packages'
    inputs:
      SourceFolder: '$(build.sourcesdirectory)'
      Contents: 'sharepoint/solution/*.sppkg'
      TargetFolder: '$(build.artifactstagingdirectory)'
      OverWrite: true
      FlattenFolders: true

  - task: PublishBuildArtifacts@1
    displayName: 'Publish artifacts'
```

## Multiple packages

- Assumes a `packages/` folder where each SharePoint Framework project lives.
- Places built `.sppkg` files in a staging `packages/` folder.

```yml
trigger:
  batch: 'true'
  branches:
    include:
      - master

variables:
  - name: release
    value: '1'

name: $(release)$(rev:.r).0+$(Date:yyyyMMdd).$(BuildID)

pool:
  name: Azure Pipelines # Update pool name

steps:
  - checkout: self
    clean: false

  - task: DeleteFiles@1
    displayName: 'Delete files from artifacts folder'
    inputs:
      SourceFolder: '$(build.artifactstagingdirectory)'
      Contents: '**'

  - powershell: |
      git clean -xdf --exclude=node_modules/
    displayName: 'Clean up all files, except for node_modules'

  - task: NodeTool@0
    displayName: 'Use Node version from .nvmrc'
    inputs:
      versionSource: 'fromFile'
      versionFilePath: '$(build.sourcesdirectory)/.nvmrc'

  - powershell: |
      $version, $metadata = ("$(Build.BuildNumber)" -split '\+')[0, -1]
      Write-Verbose "Setting package versions to $version"

      Get-ChildItem -Path "$(build.sourcesdirectory)/packages" -Recurse -Filter "package-solution.json" -Force -ErrorAction SilentlyContinue | ForEach-Object {
        $json = Get-Content $_.FullName -raw | ConvertFrom-Json
        $json.solution.version = "$version.0"
        $json | ConvertTo-Json -depth 32 | Set-Content $_.FullName
      }
    displayName: 'Set module package-solution.json to use Azure DevOps build number'

  - powershell: |
      Get-ChildItem -Path "packages" -Directory -Force | ForEach-Object {
        Push-Location $_.FullName
        npm install --loglevel=error
        npx gulp bundle --ship
        npx gulp package-solution --ship
      }
    displayName: 'Install, build and publish packages'

  - task: CopyFiles@2
    displayName: 'Copy built packages'
    inputs:
      SourceFolder: '$(build.sourcesdirectory)'
      Contents: 'packages/*/sharepoint/solution/*.sppkg'
      TargetFolder: '$(build.artifactstagingdirectory)/packages'
      OverWrite: true
      FlattenFolders: true

  - task: PublishBuildArtifacts@1
    displayName: 'Publish artifacts'
```
