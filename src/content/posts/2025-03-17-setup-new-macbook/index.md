---
title: Setting up a new MacBook in 2025 for web development
description: 'Scripts and a Brewfile for automating a new MacBook setup for web development.'
pubDate: 2025-03-17
tags: ['personal']
---

To help automate the setup of a new MacBook in 2025, I use the following scripts:

## Check for Command Line Tools update

```bash
xcode-select --install
```

## Install [homebrew](https://brew.sh/)

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### .Brewfile

Create the following `.Brewfile`, then run `brew bundle`.

```plaintext
brew "dockutil"
brew "ffmpeg"
brew "fnm"
brew "git"
brew "imagemagick"
brew "mas"
brew "yt-dlp"
brew "zsh-autosuggestions"
cask "1password"
cask "android-platform-tools"
cask "appcleaner"
cask "bambu-studio"
cask "cursor"
cask "docker"
cask "elgato-control-center"
cask "elgato-stream-deck"
cask "figma"
cask "firefox"
cask "google-chrome"
cask "imageoptim"
cask "iterm2"
cask "jabra-direct"
cask "lastfm"
cask "maccy"
cask "microsoft-edge"
cask "microsoft-office"
cask "microsoft-remote-desktop"
cask "microsoft-teams"
cask "monitorcontrol"
cask "obs"
cask "openvpn-connect"
cask "plex"
cask "powershell"
cask "sonos"
cask "steam"
cask "sublime-text"
cask "vlc"
mas "1Password for Safari", id: 1569813296
mas "Divvy", id: 413857545
mas "DuckDuckGo Privacy for Safari", id: 1482920575
mas "Microsoft Remote Desktop", id: 1295203466
mas "uBlock Origin Lite", id: 6745342698
mas "Velja", id: 1607635845
mas "Xcode", id: 497799835
```

<details>
  <summary>Packages</summary>

- [dockutil](https://formulae.brew.sh/formula/dockutil)
- [ffmpeg](https://formulae.brew.sh/formula/ffmpeg)
- [fnm](https://formulae.brew.sh/formula/fnm)
- [git](https://formulae.brew.sh/formula/git)
- [imagemagick](https://formulae.brew.sh/formula/imagemagick)
- [mas](https://formulae.brew.sh/formula/mas)
- [yt-dlp](https://formulae.brew.sh/formula/yt-dlp)
- [zsh-autosuggestions](https://formulae.brew.sh/formula/zsh-autosuggestions)

</details>

<details>
  <summary>Casks</summary>

- [1password](https://formulae.brew.sh/cask/1password)
- [android-platform-tools](https://formulae.brew.sh/cask/android-platform-tools)
- [appcleaner](https://formulae.brew.sh/cask/appcleaner)
- [bambu-studio](https://formulae.brew.sh/cask/bambu-studio)
- [cursor](https://formulae.brew.sh/cask/cursor)
- [docker](https://formulae.brew.sh/cask/docker)
- [elgato-control-center](https://formulae.brew.sh/cask/elgato-control-center)
- [elgato-stream-deck](https://formulae.brew.sh/cask/elgato-stream-deck)
- [figma](https://formulae.brew.sh/cask/figma)
- [firefox](https://formulae.brew.sh/cask/firefox)
- [google-chrome](https://formulae.brew.sh/cask/google-chrome)
- [imageoptim](https://formulae.brew.sh/cask/imageoptim)
- [iterm2](https://formulae.brew.sh/cask/iterm2)
- [jabra-direct](https://formulae.brew.sh/cask/jabra-direct)
- [lastfm](https://formulae.brew.sh/cask/lastfm)
- [maccy](https://formulae.brew.sh/cask/maccy)
- [microsoft-edge](https://formulae.brew.sh/cask/microsoft-edge)
- [microsoft-office](https://formulae.brew.sh/cask/microsoft-office)
- [microsoft-remote-desktop](https://formulae.brew.sh/cask/microsoft-remote-desktop)
- [microsoft-teams](https://formulae.brew.sh/cask/microsoft-teams)
- [monitorcontrol](https://formulae.brew.sh/cask/monitorcontrol)
- [obs](https://formulae.brew.sh/cask/obs)
- [openvpn-connect](https://formulae.brew.sh/cask/openvpn-connect)
- [plex](https://formulae.brew.sh/cask/plex)
- [powershell](https://formulae.brew.sh/cask/powershell)
- [sonos](https://formulae.brew.sh/cask/sonos)
- [steam](https://formulae.brew.sh/cask/steam)
- [sublime-text](https://formulae.brew.sh/cask/sublime-text)
- [vlc](https://formulae.brew.sh/cask/vlc)

</details>


<details>
  <summary>macOS App Store</summary>

- [1Password for Safari](https://apps.apple.com/ca/app/1password-for-safari/id1569813296)
- [Divvy](https://apps.apple.com/ca/app/divvy-window-manager/id413857545)
- [Velja](https://apps.apple.com/ca/app/velja/id1607635845)
- [Windows App](https://apps.apple.com/ca/app/windows-app/id1295203466)
- [Wyze](https://apps.apple.com/ca/app/wyze/1288415553)
- [Xcode](https://apps.apple.com/ca/app/xcode/id497799835)

</details>

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

# Install `oh-my-zsh`
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended

# Add `zsh-autosuggestions` to ~/.zshrc
grep -q "zsh-autosuggestions" ~/.zshrc || echo "source $(brew --prefix)/share/zsh-autosuggestions/zsh-autosuggestions.zsh" >> ~/.zshrc

# Add `fnm` to ~/.zshrc
grep -q "fnm" ~/.zshrc || echo 'eval "$(fnm env --use-on-cd --shell zsh)"' >> ~/.zshrc

# Install latest LTS version of Node
fnm install --lts

# Install `bum`
curl -fsSL https://raw.githubusercontent.com/owenizedd/bum/25fa0552c92aa9a1434e63d465ebaba014efe770/install.sh | bash

# Screenshots
mkdir ~/Screenshots
defaults write com.apple.screencapture location ~/Screenshots

# Show hidden files
defaults write com.apple.finder AppleShowAllFiles YES

# Hide dock
osascript -e "tell application \"System Events\" to set the autohide of the dock preferences to true"

# Restart Dock
killall Dock
```

### Manual steps

- Rename computer
- Enable SSH agent in 1Password

## 2026 update

- Updated to use `.Brewfile`
- Replaced `nvm` with `fnm` in formulae
- Added `zsh-autosuggestions` in formulae
- Added `bambu-studio`, `jabra-direct`, `openvpn-connect` to casks
- Removed `lunar`, `raycast`, `visual-studio-code` from casks
- Added *Windows App* to *App Store*
- Added `bum`, `oh-my-zsh` to manual steps
