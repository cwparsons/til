---
title: 'Using Yeoman without installing global packages'
description: 'A simple command to use Yeoman without installing npm modules globally.'
pubDate: 2022-05-28
tags: ['node']
---

I don't like installing modules globally, especially when using `nvm`, since global packages don't apply to every version.

Using _Yeoman_ is a pain without global packages, but the following commands help:

```bash
npx -p yo -p {{generator package}}@latest
```

## Example for SharePoint Framework

```bash
npx -p yo -p @microsoft/generator-sharepoint@latest --yes -- yo @microsoft/sharepoint --skip-install --solution-name "spfx-project-template" --component-type "webpart" --component-description "HelloWorld description" --component-name "HelloWorld" --framework "react" --package-manager "npm" --skip-feature-deployment
```
