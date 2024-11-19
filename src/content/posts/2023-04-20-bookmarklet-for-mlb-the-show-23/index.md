---
title: 'Bookmarklet for MLB The Show'
description: 'A bookmarklet to help collect cards in MLB The Show.'
pubDate: 2023-04-20
tags: ['bookmarklet']
---

_MLB The Show 23_ has a game mode called _Diamond Dynasty_, similar to EA's _Ultimate Team_. The game has a web page to help view inventory and purchase players using in-game currency. This bookmarklet submits bids for players at one currency more than the highest bid.

```javascript
//@ts-check
javascript: (() => {
  if (window.location.href.includes('/inventory')) {
    const links = document.querySelectorAll(
      'body > div.page-wrap > div.page-body > div > div.layout-primary > div > div.scrollable.has-scroll > div > table > tbody > tr > td:nth-child(3) > a',
    );

    for (let link of links) {
      if (sessionStorage.getItem(link.href) === null) {
        sessionStorage.setItem(link.href, 'true');
        link.click();
        break;
      }
    }

    return;
  }

  if (document.querySelector('form[action*="cancel"]')) {
    document.querySelector('body > div.page-wrap-items > div.referer-block > div > a').click();
    return;
  }

  const saleTableContainer = document.evaluate(
    '//h2[text()="Sell"]',
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue.parentElement;
  const cheapestSaleElement = saleTableContainer.querySelector(
    'tbody > tr:nth-child(1) > td:nth-child(2)',
  );
  const price = parseInt(cheapestSaleElement?.innerText?.trim() ?? '25');

  const input = document.querySelector(
    'form[action*="create_buy_order"]:has(input[name="authenticity_token"]) #price',
  );
  input.value = price + 1;
  input.form.querySelector('button[type="submit"]').click();

  console.log(`Buying player for ${price + 1}`);
})();
```
