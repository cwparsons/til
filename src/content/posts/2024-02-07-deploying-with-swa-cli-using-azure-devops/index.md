---
title: Deploying a Next.js app to SWA using the CLI and Azure DevOps
description: A YML build pipeline for Azure DevOps to deploy a Next.js app to Azure Static Web App using the SWA CLI.
pubDate: 2024-02-07
tags: ['azure-devops']
---

**Notes:**

- Requires a `AZURE_STATIC_WEB_APPS_API_TOKEN` environment variable to be available.
- Assumes a `.nvmrc` file in the root with a specified version of Node.

```yml
name: $(BuildID)+$(Date:yyyyMMdd)

trigger:
  batch: true
  branches:
    include:
      - main

pool:
  name: Azure Pipelines # Update with pool name

stages:
  - stage: Build

    jobs:
      - job:
        steps:
          - checkout: self

          - task: NodeTool@0
            displayName: 'Use Node version from .nvmrc'
            inputs:
              versionSource: 'fromFile'
              versionFilePath: '$(build.sourcesdirectory)/.nvmrc'

          - script: npm install
            displayName: Install npm dependencies

          - script: npx @azure/static-web-apps-cli build
            displayName: Build NextJS site and API
            env:
              NEXT_PUBLIC_BUILD_NUMBER: $(Build.BuildNumber)

          # Optionally include APIs.
          - task: CopyFiles@2
            displayName: 'Copy `api/` to staging'
            inputs:
              SourceFolder: '$(build.sourcesdirectory)/api'
              TargetFolder: '$(build.artifactstagingdirectory)/api'
              OverWrite: true

          - task: CopyFiles@2
            displayName: 'Copy `out/` to staging'
            inputs:
              SourceFolder: '$(build.sourcesdirectory)/out'
              TargetFolder: '$(build.artifactstagingdirectory)/out'
              OverWrite: true

          - task: PublishBuildArtifacts@1
            displayName: 'Publish artifacts'

  - stage: Preview
    displayName: Deploy to preview

    dependsOn:
      - Build

    jobs:
      - job:
        steps:
          - checkout: none

          - task: DownloadPipelineArtifact@2
            inputs:
              buildType: 'current'
              artifactName: 'drop'
              targetPath: '$(build.sourcesdirectory)'

          - task: NodeTool@0
            displayName: 'Use Node version from .nvmrc'
            inputs:
              versionSource: 'fromFile'
              versionFilePath: '$(build.sourcesdirectory)/.nvmrc'

          - script: npx @azure/static-web-apps-cli deploy --env preview --api-location "$(build.sourcesdirectory)/api" --app-location "$(build.sourcesdirectory)/out" --verbose=silly --deployment-token $(AZURE_STATIC_WEB_APPS_API_TOKEN)
            displayName: Deploy to preview

          # Spot to add integration testing on preview.

  - stage: Production
    displayName: Deploy to production

    dependsOn:
      - Preview

    jobs:
      - job:
        steps:
          - checkout: none

          - task: DownloadPipelineArtifact@2
            inputs:
              buildType: 'current'
              artifactName: 'drop'
              targetPath: '$(build.sourcesdirectory)'

          - task: NodeTool@0
            displayName: 'Use Node version from .nvmrc'
            inputs:
              versionSource: 'fromFile'
              versionFilePath: '$(build.sourcesdirectory)/.nvmrc'

          - script: npx @azure/static-web-apps-cli deploy --env production --api-location "$(build.sourcesdirectory)/api" --app-location "$(build.sourcesdirectory)/out" --verbose=silly --deployment-token $(AZURE_STATIC_WEB_APPS_API_TOKEN)
            displayName: Deploy to production
```
