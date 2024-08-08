---
title: 'ClientSidePages translation error'
description: '"The web has source language 1033 while the template expects 0" error message.'
pubDate: 2023-08-23
tags: ['spfx', 'error']
---

While trying to provision a translated `pnp:ClientSidePage`, I got the error:

> The web has source language 1033 while the template expects 0

Turns out the original `pnp:ClientSidePage` needed to have my source language in an `LCID` attribute, which was missing.
