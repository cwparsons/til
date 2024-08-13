---
title: Showing managed metadata tag names in PnP Modern Search result templates
description: How to convert a managed metadata value into a readable result in a PnP Modern Search result template.
pubDate: 2024-04-01
tags: ['pnp-modern-search']
---

When retrieving a mapped managed metadata value from a search result, you might get the following back:

```json
"RefinableString100": "GP0|#f1527ba5-5934-44f9-85d2-bb05dde6630a;L0|#f77cc337-58b0-4791-b4c8-6d38f8882718|Sample term;GTSet|#f8c2158b-6890-4f8a-b016-c73676672638",
```

To get just the value _Sample term_, we can split it and loop through the values. If one starts with `L0`, we can use `getTagName` to get the text. This works with multiple tags too. It outputs _(None)_ if there are no values.

```handlebars
{{#if item.RefinableString100}}
  <ul>
    {{#each (split item.RefinableString100 ';') as |tag|}}
      {{#startsWith 'L0' tag}}
        <li>{{getTagName tag}}</li>
      {{/startsWith}}
    {{/each}}
  </ul>
{{else}}
  <span>(None)</span>
{{/if}}
```
