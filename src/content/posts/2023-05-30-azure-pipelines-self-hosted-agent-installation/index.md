---
title: 'Azure Pipelines self-hosted agent installation'
description: 'Instructions on installing Azure Pipelines self-hosted agents.'
pubDate: 2023-08-23
tags: ['azure-devops']
---

A simple set of instructions for installing self-hosted agents for Azure DevOps. This helps when needing to create many agents at once.

## References

- [Self-hosted Windows agents](https://learn.microsoft.com/en-us/azure/devops/pipelines/agents/windows-agent?view=azure-devops)
- [Chocolately installation](https://chocolatey.org/install)
- [Chocolately community packages](https://community.chocolatey.org/packages)

## Steps

1. Install Windows updates. May require restart.

2. Install [Chocolately](https://chocolatey.org/install)

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

3. Install agent dependencies

```powershell
choco install visualstudio2022buildtools -y
```

4. Download agent

```powershell
mkdir C:\Installs
Invoke-WebRequest -Uri "https://vstsagentpackage.azureedge.net/agent/3.220.2/vsts-agent-win-x64-3.220.2.zip" -OutFile "C:\Installs\vsts-agent-win-x64-3.220.2.zip"
```

5. Create directory for new agent. The naming structure for the agent name and folder is `{{computer name}}-agent{{number}}`

```powershell
mkdir C:\build01-agent01
cd C:\build01-agent01
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::ExtractToDirectory("C:\Installs\vsts-agent-win-x64-3.220.2.zip", "$PWD")
```

6. Configure the agent

```powershell
.\config.cmd --unattended --url https://dev.azure.com/[organizaiton] --auth PAT --token [token] --pool "Self-hosted" --agent build01-agent01 --runAsService --windowsLogonAccount "NT AUTHORITY\NETWORK SERVICE"
```
