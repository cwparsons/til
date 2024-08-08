---
title: 'SharePoint Framework debug bookmarklet'
description: 'A bookmarklet to add the SPFx debug query strings.'
pubDate: 2021-08-01
tags: ['bookmarklet', 'spfx']
---

This bookmark adds the default `?loadSPFX=true&debugManifestsFile=https://localhost:4321/temp/manifests.js` query string to the current URL.

<a href='javascript:function updateQueryStringParameter(uri, key, value) %7B var re = new RegExp("(%5B?&%5D)" + key + "=.\*?(&%7C$)", "i"); var separator = uri.indexOf("?") !== -1 ? "&" : "?"; if (uri.match(re)) %7B return uri.replace(re, "$1" + key + "=" + value + "$2"); %7D else %7B return uri + separator + key + "=" + value; %7D%7Dvar url = window.location.href;url = updateQueryStringParameter(url, "loadSPFX", "true");url = updateQueryStringParameter(url, "debugManifestsFile", "https://localhost:4321/temp/manifests.js");window.location.href = url;'>Drag this to your bookmark bar</a>.

```javascript
javascript:function updateQueryStringParameter(uri, key, value) %7B  var re = new RegExp("(%5B?&%5D)" + key + "=.*?(&%7C$)", "i");  var separator = uri.indexOf("?") !== -1 ? "&" : "?";  if (uri.match(re)) %7B    return uri.replace(re, "$1" + key + "=" + value + "$2");  %7D else %7B    return uri + separator + key + "=" + value;  %7D%7Dvar url = window.location.href;url = updateQueryStringParameter(url, "loadSPFX", "true");url = updateQueryStringParameter(url,    "debugManifestsFile",    "https://localhost:4321/temp/manifests.js");window.location.href = url;
```
