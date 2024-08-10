---
title: Show recently created or updated tags in PnP Modern Search
description: Show a badge on search results that are recently created or recently updated in PnP Modern Search.
pubDate: 2023-09-01
tags: ['pnp-modern-search', 'sharepoint']
---

The following Handlebars template shows **New** if the item is created in the past 7 days. If it's not new, it will show **Recently updated** if the item was modified in the past 7 days.

```handlebars
{{#if (lt (divide (minus (getDate (date) 'X') (getDate item.Created 'X')) 86400) 7)}}
  <b title='Created on {{getDate item.Created "LL"}}'>New</b>
{{else}}
  {{#if (lt (divide (minus (getDate (date) 'X') (getDate item.ModifiedOWSDATE 'X')) 86400) 7)}}
    <b
      title='Last updated on {{getDate item.ModifiedOWSDATE "LL"}}.
      Created on {{getDate item.Created "LL"}}'
    >
      Recently updated
    </b>
  {{/if}}
{{/if}}
```
