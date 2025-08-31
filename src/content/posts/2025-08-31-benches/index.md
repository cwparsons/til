---
title: Bench dedications
description: "Personal project to document all bench dedications in hometown"
pubDate: 2025-08-31
tags: ['personal', 'astro']
---

While surfing the web, I found [OpenBenches](https://openbenches.org/), a site
that catalogs all memorial benches across the world. I didn't see any entries
for my city, but forgot about it. A few months later while walking to the park
with my son, I was reminded of the site while looking at park benches. I started
[taking photos](https://openbenches.org/user/9550) and came up with a goal to
capture all the benches close by.

To help figure that out, I found all the [bench data](https://maps.richmond.ca/parks/dedicationprogram/)
and then created a site that overlaid my own OpenBenches progress on top.

[Bench dedications](https://benches.cwparsons.ca/)

## Features

- Show all OpenBench data on a map
- Match up city data with OpenBench data to show remainders
- Group remaining data by park/region
- Show total progress and progress in each park/region
- Search dedication text

## Improvements and stuff to figure out

- The city data is not great. Some benches are just physically not there, or their
dedication plaque has been removed
- Unclear how to deal with multiple plaques on one bench
- Do tables count as benches?
- Many benches near me are inaccessible by construction
- Lots of benches are on gravel paths, which isn't great for pushing a stroller

## Vibe coding

This is my first project where I've tried to use AI to generate as much code as
possible.

- Every new feature makes the entire project harder to understand, so after a few,
I've prompted to refactor the work.
- Functionality I knew how to write by hand was easy to review. Functionality I
had not dealt with before, like Cloudflare's Wrangler configuration, ended up
being complicated to troubleshoot.
- Describing styling as a propmt is hard and I resorted to changing Tailwind
classes by hand to it to look right.
- To troubleshoot certain bugs, the output added console logs and asked the output
to be pasted into chat. I'm sure there is some browser/MCP way to do this that
would have made it easier.
- One bug could never be fixed by prompting. It would generate a fix that would
cause a second issue and then fix that issue which would return to the original
bug.
