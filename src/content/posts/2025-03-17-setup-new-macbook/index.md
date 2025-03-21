---
title: Setting up a new MacBook Air in 2025 for web development
description: ""
pubDate: 2025-03-17
tags: ['personal']
---

To help automate the setup of a new MacBook Air in 2025, I use the following scripts:

## Install [homebrew](https://brew.sh/)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Packages

```bash
brew install dockutil ffmpeg git imagemagick mas nvm yt-dlp
```

- [dockutil](https://formulae.brew.sh/formula/dockutil)
- [ffmpeg](https://formulae.brew.sh/formula/ffmpeg)
- [git](https://formulae.brew.sh/formula/git)
- [imagemagick](https://formulae.brew.sh/formula/imagemagick)
- [mas](https://formulae.brew.sh/formula/mas)
- [yt-dlp](https://formulae.brew.sh/formula/yt-dlp)

### Casks

```bash
brew install --cask 1password android-platform-tools appcleaner cursor docker elgato-control-center elgato-stream-deck figma firefox google-chrome imageoptim iterm2 lastfm lunar microsoft-edge microsoft-office microsoft-remote-desktop microsoft-teams monitorcontrol obs plex powershell raycast sonos steam sublime-text visual-studio-code vlc
```

- [1password](https://formulae.brew.sh/cask/1password)
- [android-platform-tools](https://formulae.brew.sh/cask/android-platform-tools)
- [appcleaner](https://formulae.brew.sh/cask/appcleaner)
- [cursor](https://formulae.brew.sh/cask/cursor)
- [docker](https://formulae.brew.sh/cask/docker)
- [elgato-control-center](https://formulae.brew.sh/cask/elgato-control-center)
- [elgato-stream-deck](https://formulae.brew.sh/cask/elgato-stream-deck)
- [figma](https://formulae.brew.sh/cask/figma)
- [firefox](https://formulae.brew.sh/cask/firefox)
- [google-chrome](https://formulae.brew.sh/cask/google-chrome)
- [imageoptim](https://formulae.brew.sh/cask/imageoptim)
- [iterm2](https://formulae.brew.sh/cask/iterm2)
- [lastfm](https://formulae.brew.sh/cask/lastfm)
- [lunar](https://formulae.brew.sh/cask/lunar)
- [microsoft-edge](https://formulae.brew.sh/cask/microsoft-edge)
- [microsoft-office](https://formulae.brew.sh/cask/microsoft-office)
- [microsoft-remote-desktop](https://formulae.brew.sh/cask/microsoft-remote-desktop)
- [microsoft-teams](https://formulae.brew.sh/cask/microsoft-teams)
- [monitorcontrol](https://formulae.brew.sh/cask/monitorcontrol)
- [obs](https://formulae.brew.sh/cask/obs)
- [plex](https://formulae.brew.sh/cask/plex)
- [powershell](https://formulae.brew.sh/cask/powershell)
- [raycast](https://formulae.brew.sh/cask/raycast)
- [sonos](https://formulae.brew.sh/cask/sonos)
- [steam](https://formulae.brew.sh/cask/steam)
- [sublime-text](https://formulae.brew.sh/cask/sublime-text)
- [visual-studio-code](https://formulae.brew.sh/cask/visual-studio-code)
- [vlc](https://formulae.brew.sh/cask/vlc)

## macOS Store

Some apps can be only installed (or have been previously purchased) through the MacOS App Store. The installation of `mas` allows for installing these via terminal.

```bash
mas install 1569813296 # 1Password for Safari
mas install 413857545 # Divvy
mas install 1607635845 # Velja
mas install 1288415553 # Wyze
mas install 497799835 # Xcode
```

- [1Password for Safari](https://apps.apple.com/ca/app/1password-for-safari/id1569813296)
- [Divvy](https://apps.apple.com/ca/app/divvy-window-manager/id413857545)
- [Velja](https://apps.apple.com/ca/app/velja/id1607635845)
- [Xcode](https://apps.apple.com/ca/app/xcode/id497799835)

### Manual install

- [Wyze](https://apps.apple.com/ca/app/wyze-make-your-home-smarter/id1288415553)
- [DuckDuckGo Privacy for Safari](https://apps.apple.com/ca/app/duckduckgo-privacy-for-safari/id1482920575)

## macOS changes

```bash
# Dock
dockutil --remove 'App Store'
dockutil --remove 'iPhone Mirroring'
dockutil --remove Calendar
dockutil --remove Contacts
dockutil --remove FaceTime
dockutil --remove Freeform
dockutil --remove Keynote
dockutil --remove Mail
dockutil --remove Maps
dockutil --remove News
dockutil --remove Notes
dockutil --remove Numbers
dockutil --remove Pages
dockutil --remove Photos
dockutil --remove Reminders
dockutil --remove Safari
dockutil --remove TV

dockutil --add /Applications/Firefox.app
dockutil --add /Applications/Cursor.app
dockutil --add /Applications/iTerm.app

# Screenshots
mkdir ~/Screenshots
defaults write com.apple.screencapture location ~/Screenshots

# Show hidden files
defaults write com.apple.finder AppleShowAllFiles YES

# Hide dock
osascript -e "tell application \"System Events\" to set the autohide of the dock preferences to true"
```

### Manual steps

- Rename computer
- Enable SSH agent in 1Password