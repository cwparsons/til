---
title: 'Mass download images from Dropbox'
description: 'When receiving a link from Dropbox that is too big to download a ZIP, you may need to automate the download process.'
pubDate: 2022-09-29
tags: ['personal']
---

When receiving a link from Dropbox that is too big to download a ZIP, you may need to automate the download process.

## Download script

This script can be run when in the image preview window. It downloads the current image and then moves to the next image.

```javascript
window.dropboxInterval = setInterval(() => {
  document.querySelector('.dig-Button').click();
  document.querySelector('[aria-label="Next"]').click();
}, 1000);
```

### Notes

- I started with an interval of 500ms, but this was too fast and my browser wasn't able to keep up with the downloads. This probably wasn't bad, but I cancelled out and increased the interval to 1000ms.
- Nothing appeared to throttle me.
- At the 400~ image mark, the browser tab process crashed and I needed to restart the script at the last downloaded image.

## Image conversion and resize

To convert the images from PNG to JPG and resize them down to a maximum width:

```bash
for image in *.png ;
do
    convert "$image" -resize 2880x\> -quality 92 "${image%.*}.jpg" ;
done
```

### Notes

- This resizes the images from original to a maximum of 2880px wide, which is retina for a normal laptop screen.
- Default quality of ImageMagick is 85, this upps it to 92.
