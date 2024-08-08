---
title: 'SharePoint maintenance mode bookmarklet'
description: 'A bookmarklet to update a SharePoint page to maintenance mode.'
pubDate: 2021-07-01
tags: ['bookmarklet', 'spfx']
---

This bookmark adds the default `?maintenancemode=true` query string to the current URL.

<a href='javascript:function updateQueryStringParameter(uri, key, value) %7B  var re = new RegExp("(%5B?&%5D)" + key + "=.*?(&%7C$)", "i");  var separator = uri.indexOf("?") !== -1 ? "&" : "?";  if (uri.match(re)) %7B    return uri.replace(re, "$1" + key + "=" + value + "$2");  %7D else %7B    return uri + separator + key + "=" + value;  %7D%7Dconst url = updateQueryStringParameter(window.location.href, %27maintenancemode%27, %27true%27);window.location.href = url;'>Drag this to your bookmark bar</a>.

```javascript
javascript:function updateQueryStringParameter(uri, key, value) %7B  var re = new RegExp("(%5B?&%5D)" + key + "=.*?(&%7C$)", "i");  var separator = uri.indexOf("?") !== -1 ? "&" : "?";  if (uri.match(re)) %7B    return uri.replace(re, "$1" + key + "=" + value + "$2");  %7D else %7B    return uri + separator + key + "=" + value;  %7D%7Dconst url = updateQueryStringParameter(window.location.href, %27maintenancemode%27, %27true%27);window.location.href = url;
```
