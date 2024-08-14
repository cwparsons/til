---
title: Power Apps text width formulas
description: A list of formulas for generating widths for text.
pubDate: 2024-07-01
tags: ['power-platform']
---

Inspired by this [Reddit post](https://www.reddit.com/r/PowerApps/comments/yci4vl/formula_created_for_dynamic_width_label_or_any/?rdt=54535), this CodePen creates formulas that can be used to determine text widths based on the content of a text component in Power Apps. It uses JavaScript to inspect the width of every character and then generates a formula that groups these characters.

This might be useful in scenarios where you need a text component to be the most minimal width in a horizontal container, like if it were an item of a flexed element in HTML.

In the end, this functionality was not used, and the HTML component with inline flex styles was used instead.

<iframe height="500" style="width: 100%;" scrolling="no" title="Power Apps width formulas for Segoe UI" src="https://codepen.io/cparsons/embed/RwmrPBj?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/cparsons/pen/RwmrPBj">
  Power Apps width formulas for Segoe UI</a> by Christopher Parsons (<a href="https://codepen.io/cparsons">@cparsons</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
