---
title: 'SharePoint Framework debug bookmarklet'
description: 'A bookmarklet to add the SPFx debug query strings.'
pubDate: 2021-08-01
tags: ['bookmarklet', 'sharepoint-spfx']
---

This bookmark adds the default development query string for SPFx to the current URL.

```text
?loadSPFX=true&debugManifestsFile=https://localhost:4321/temp/manifests.js
```

<a href='javascript:function updateQueryStringParameter(uri, key, value) %7B var re = new RegExp("(%5B?&%5D)" + key + "=.\*?(&%7C$)", "i"); var separator = uri.indexOf("?") !== -1 ? "&" : "?"; if (uri.match(re)) %7B return uri.replace(re, "$1" + key + "=" + value + "$2"); %7D else %7B return uri + separator + key + "=" + value; %7D%7Dvar url = window.location.href;url = updateQueryStringParameter(url, "loadSPFX", "true");url = updateQueryStringParameter(url, "debugManifestsFile", "https://localhost:4321/temp/manifests.js");window.location.href = url;'>Drag this to your bookmark bar</a>.

```javascript
function updateQueryStringParameter(uri, key, value) {
  var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');

  var separator = uri.indexOf('?') !== -1 ? '&' : '?';

  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + '=' + value + '$2');
  } else {
    return uri + separator + key + '=' + value;
  }
}

var url = window.location.href;

url = updateQueryStringParameter(url, 'loadSPFX', 'true');
url = updateQueryStringParameter(
  url,
  'debugManifestsFile',
  'https://localhost:4321/temp/manifests.js',
);

window.location.href = url;
```
