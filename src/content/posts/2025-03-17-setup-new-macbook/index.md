---
title: Setting up a new MacBook Air in 2025 for web development
description: ""
pubDate: 2025-03-17
tags: ['personal']
---

To help automate the setup of a new MacBook Air in 2025, I use the following scripts:

## Install homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew update
```

## homebrew

```bash
brew install dockutil ffmpeg git imagemagick nvm yt-dlp
```

- [dockutil](https://formulae.brew.sh/formula/dockutil)
- [ffmpeg](https://formulae.brew.sh/formula/ffmpeg)
- [git](https://formulae.brew.sh/formula/git)
- [imagemagick](https://formulae.brew.sh/formula/imagemagick)
- [mas](https://formulae.brew.sh/formula/mas)
- [yt-dlp](https://formulae.brew.sh/formula/yt-dlp)

## homebrew casks

Casks are

```bash
brew install --cask 1password android-platform-tools cursor docker-desktop elgato-control-center elgato-stream-deck figma firefox github google-chrome jabra-direct imageoptim lastfm logitech-g-hub lunar microsoft-edge microsoft-office microsoft-teams microsoft-remote-desktop monitorcontrol obs plex powershell raycast sonos steam sublime-text vlc
```

- [1password](https://formulae.brew.sh/cask/1password)
- [android-platform-tools](https://formulae.brew.sh/cask/android-platform-tools)
- [cursor](https://formulae.brew.sh/cask/cursor)
- [docker-desktop](https://formulae.brew.sh/cask/docker-desktop)
- [elgato-control-center](https://formulae.brew.sh/cask/elgato-control-center)
- [elgato-stream-deck](https://formulae.brew.sh/cask/elgato-stream-deck)
- [figma](https://formulae.brew.sh/cask/figma)
- [firefox](https://formulae.brew.sh/cask/firefox)
- [github](https://formulae.brew.sh/cask/github)
- [google-chrome](https://formulae.brew.sh/cask/google-chrome)
- [jabra-direct](https://formulae.brew.sh/cask/jabra-direct)
- [imageoptim](https://formulae.brew.sh/cask/imageoptim)
- [lastfm](https://formulae.brew.sh/cask/lastfm)
- [logitech-g-hub](https://formulae.brew.sh/cask/logitech-g-hub)
- [lunar](https://formulae.brew.sh/cask/lunar)
- [microsoft-edge](https://formulae.brew.sh/cask/microsoft-edge)
- [microsoft-office](https://formulae.brew.sh/cask/microsoft-office)
- [microsoft-teams](https://formulae.brew.sh/cask/microsoft-teams)
- [microsoft-remote-desktop](https://formulae.brew.sh/cask/microsoft-remote-desktop)
- [monitorcontrol](https://formulae.brew.sh/cask/monitorcontrol)
- [obs](https://formulae.brew.sh/cask/obs)
- [plex](https://formulae.brew.sh/cask/plex)
- [powershell](https://formulae.brew.sh/cask/powershell)
- [raycast](https://formulae.brew.sh/cask/raycast)
- [sonos](https://formulae.brew.sh/cask/sonos)
- [steam](https://formulae.brew.sh/cask/steam)
- [sublime-text](https://formulae.brew.sh/cask/sublime-text)
- [vlc](https://formulae.brew.sh/cask/vlc)

## nvm

Create `~/.zshrc` file to load `nvm`.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash
```

```bash
nvm install 22.14.0
```

## xcode

```bash
xcode-select --install
```

### macOS Store

Some apps can be only installed (or have been previously purchased) through the MacOS App Store. The installation of `mas` allows for installing these via terminal.

```bash
mas install 1569813296 # 1Password for Safari
mas install 413857545 # Divvy
mas install 1288415553 # Wyze
```

- [1Password for Safari](https://apps.apple.com/ca/app/1password-for-safari/id1569813296)
- [Divvy](https://apps.apple.com/ca/app/divvy-window-manager/id413857545)
- [Wyze](https://apps.apple.com/ca/app/wyze-make-your-home-smarter/id1288415553)

## macOS changes

```bash
# Dock
dockutil --remove Safari
dockutil --remove Maps
dockutil --remove Photos
dockutil --remove FaceTime
dockutil --remove Calendar
dockutil --remove Contacts
dockutil --remove Reminders
dockutil --remove Notes
dockutil --remove Freeform
dockutil --remove TV
dockutil --remove News
dockutil --remove 'App Store'

# Screenshots
mkdir ~/Screenshots
defaults write com.apple.screencapture location ~/Screenshots

# Show hidden files
defaults write com.apple.finder AppleShowAllFiles YES
```

## Manual steps

- [Rename computer](https://www.idownloadblog.com/2014/08/08/how-to-change-mac-name/)
- Sign into Firefox, Google Chrome and Microsoft Edge profiles