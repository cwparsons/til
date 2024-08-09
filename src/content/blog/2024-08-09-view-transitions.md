---
title: View transitions
description: Initial learnings about how to use the view transition API
pubDate: 2024-08-09
tags: ['css']
---

I added view transitions to this site and am happy with the basic result in that it matched what I thought it would in my head.

Reading up on the [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) is a little daunting. After transitions, I haven't had to implement designs with complex animations. There are a bunch of [guides](https://www.smashingmagazine.com/2023/12/view-transitions-api-ui-animations-part1/) for view transitions, so following examples seems straight forward, but I dread needing to implement something brand new.

```css
@media not (prefers-reduced-motion) {
  @view-transition {
    navigation: auto;
  }
}
```

I struggled initially trying to use both the Astro functionality (`<ViewTransitions>`) and native CSS functionality. Moving towards just the CSS approach made things easier, but I forgot to remove some of the original Astro transition props.

One thing I don't like with my implementation is that if you scroll down on the homepage, click on a blog post, then click on the logo to return to the homepage, the original link is no longer in the viewport. This looks a little janky. There seems to be discussion in the CSS group regarding this [issue](https://github.com/w3c/csswg-drafts/issues/8282).
