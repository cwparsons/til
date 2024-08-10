---
title: 'Looping through people in a PnP Modern Search result template'
description: 'A method for looping through people values in a PnP Modern Search result template.'
pubDate: 2024-05-31
tags: ['pnp-modern-search', 'sharepoint-spfx']
---

When retrieving multiple users using PnP Modern Search, you'll get something like this:

```json
{
  "DocumentOwnerOWSUSER": "user1@contoso.onmicrosoft.com | User One | C2D1...A407 i:0#.f|membership|user1@contoso.onmicrosoft.com\n\nuser2@contoso.onmicrosoft.com | User Two | C2D1...A407 i:0#.f|membership|user2@contoso.onmicrosoft.com"
}
```

Unfortunately, using `handlebars` and `handlebars-helpers`, it's not possible to split on the new lines (`\n\n`).

Instead, we can split `|` and hardcode the indexes to get the email and name.

```handlebars
{{#if item.DocumentOwnerOWSUSER}}
  <ul>
    {{#withGroup (after (split item.DocumentOwnerOWSUSER '|') 1) 4}}
      <li>
        <picture>
          <img
            alt='Photo for {{itemAt this 0}}'
            height='24'
            loading='lazy'
            src='/_layouts/15/userphoto.aspx?size=L&username={{getUserEmail (itemAt this 3)}}'
            width='24'
          />
        </picture>
        <span>{{itemAt this 0}}</span>
      </li>
    {{/withGroup}}
  </ul>
{{else}}
  (None)
{{/if}}
```
