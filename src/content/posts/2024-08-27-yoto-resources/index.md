---
title: Yoto Player experience
description: Resources and notes regarding the Yoto Player.
pubDate: 2024-08-27
tags: ['personal']
---

The [Yoto Player](https://www.yotoplay.com/) has been a fun addition to our household and we've been leveraging their [Make Your Own](https://www.yotoplay.com/make-your-own) cards a lot. Funnily enough, I only heard about the product due to their [recall on one of their products](https://www.theverge.com/2024/4/11/24127410/yoto-mini-speaker-recall-psa-burn-risk).

## Useful links

- [r/YotoPlayer](https://old.reddit.com/r/YotoPlayer/)
- [Yoto Icons](https://www.yotoicons.com/)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- [yt-dlp cookies](https://old.reddit.com/r/youtubedl/wiki/cookies)

## Notes

- Using the [web app](https://my.yotoplay.com/my-cards/playlists) is best to create cards and playlists, not the app.
- Selecting unique icons for each track is hard.
- I recorded myself reading a bunch of kid's books, but my son didn't seem to like them.
- `yt-dlp` can pull music from YouTube easily.
  ```bash
  yt-dlp -x -f bestaudio --extract-audio --audio-quality 0 --audio-format mp3 --cookies cookies.txt -o '%(title)s.%(ext)s' https://music.youtube.com/playlist\?list\=PLkrDMi8luNY8myLTDcSCtdcMJqtHP-0ww
  ```
- I still need to figure out the best way to print full colour stickers for the _Make Your Own_ cards
