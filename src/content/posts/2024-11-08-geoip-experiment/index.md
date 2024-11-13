---
title: GeoIP experiment
description: Figuring out how accurate GeoIP locations are versus GPS.
pubDate: 2024-11-08
tags: ['personal', 'nextjs']
---

On some projects, we use IP address lookup to personalize content. However, we've
been curious how well this works on mobile networks. To help test this, I got
[v0.dev](https://v0.dev/chat/c2JFn44z3LG?b=b_3GYXdeIV92Z) to build out a page
that compares the IP address lookup (through Vercel) versus what the device GPS
spits out.

![Screenshot of the experiment](image.png)

[Try the experiment](https://geoip-nextjs-experiment.vercel.app/).

Check out the [GitHub repository](https://github.com/cwparsons/geoip-nextjs-experiment).
