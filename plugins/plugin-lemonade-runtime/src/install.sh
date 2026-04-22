#!/usr/bin/env bash
# agi-lemonade-runtime installer — per-OS Lemonade + FastFlowLM setup.
#
# Invoked by AGI's system-service manager as the `installCommand` via
# `execFile("bash", ["-c", <contents of this script>])`. Detects the
# host OS + version, then runs the right install sequence.
#
# For AMD XDNA 2 hardware on Ubuntu: Lemonade-team PPA + libxrt-npu2 +
# amdxdna-dkms + the FLM .deb from the lemonade-sdk GitHub releases.
# Kernel module DKMS install means a reboot is RECOMMENDED afterwards
# (not strictly required if the kernel already has amdxdna loaded, which
# is true on Ubuntu 24.04 HWE with kernel 6.11+).

set -euo pipefail

# Non-interactive by default — when invoked from AGI's system-service
# install endpoint there's no TTY, and debconf prompts otherwise wedge
# the whole apt transaction.
export DEBIAN_FRONTEND=noninteractive

emit() {
  printf '{"phase":"lemonade-install","status":"%s","details":"%s"}\n' "$1" "$2"
}

# FLM is published by the FastFlowLM project (separate from lemonade-sdk).
# Per-Ubuntu-version .debs with predictable naming.
FLM_RELEASE_URL="https://api.github.com/repos/FastFlowLM/FastFlowLM/releases/latest"

detect_os() {
  local os_name
  os_name="$(uname -s)"
  case "$os_name" in
    Linux)
      if [ -f /etc/os-release ]; then
        # shellcheck disable=SC1091
        . /etc/os-release
        echo "linux:${ID:-unknown}:${VERSION_ID:-unknown}"
      else
        echo "linux:unknown:unknown"
      fi
      ;;
    Darwin) echo "macos:darwin:$(sw_vers -productVersion 2>/dev/null || echo unknown)" ;;
    *) echo "$os_name:unknown:unknown" ;;
  esac
}

install_ubuntu() {
  local version="$1"
  emit "start" "Ubuntu $version detected"
  case "$version" in
    24.04|25.10)
      emit "apt" "adding lemonade-team PPA"
      sudo add-apt-repository -y ppa:lemonade-team/stable
      sudo apt update
      emit "apt" "installing libxrt-npu2 + amdxdna-dkms + lemonade-server"
      sudo -E DEBIAN_FRONTEND=noninteractive apt install -y libxrt-npu2 amdxdna-dkms lemonade-server
      ;;
    26.04)
      emit "apt" "installing libxrt-npu2 + amdxdna-dkms + lemonade-server (already in archive)"
      sudo -E DEBIAN_FRONTEND=noninteractive apt install -y libxrt-npu2 amdxdna-dkms lemonade-server
      ;;
    *)
      emit "error" "Ubuntu $version is not currently tested. Lemonade officially supports 24.04, 25.10, 26.04."
      return 1
      ;;
  esac

  # FastFlowLM .deb — per-Ubuntu-version asset from FastFlowLM/FastFlowLM
  # releases. Filename pattern: fastflowlm_VERSION_ubuntu<ver>_amd64.deb.
  emit "flm" "resolving FastFlowLM .deb for Ubuntu $version"
  local flm_url
  flm_url="$(
    curl -sL "$FLM_RELEASE_URL" \
      | grep -oE "https://[^\"]+fastflowlm_[^\"]+_ubuntu${version}_amd64\.deb" \
      | head -1
  )"
  if [ -z "$flm_url" ]; then
    emit "error" "could not resolve FastFlowLM .deb for Ubuntu $version from FastFlowLM/FastFlowLM releases"
    return 1
  fi
  emit "flm" "downloading $flm_url"
  local tmp
  tmp="$(mktemp -t flm-XXXXXX.deb)"
  curl -sL -o "$tmp" "$flm_url"
  emit "flm" "installing FastFlowLM .deb"
  sudo -E DEBIAN_FRONTEND=noninteractive apt install -y "$tmp"
  rm -f "$tmp"

  emit "done" "lemonade-server + FastFlowLM installed. Lemonade listens on port 13305. Reboot recommended but not strictly required — amdxdna module is already loaded on this kernel."
  return 0
}

install_arch() {
  emit "start" "Arch Linux detected"
  if command -v paru >/dev/null 2>&1; then
    paru -S --noconfirm lemonade-sdk-bin || {
      emit "error" "paru install failed. Try: yay -S lemonade-sdk-bin"
      return 1
    }
  elif command -v yay >/dev/null 2>&1; then
    yay -S --noconfirm lemonade-sdk-bin || {
      emit "error" "yay install failed."
      return 1
    }
  else
    emit "error" "No AUR helper found. Install paru or yay, then re-run."
    return 1
  fi
  emit "done" "Lemonade installed via AUR."
}

install_fedora() {
  emit "start" "Fedora detected"
  # Placeholder: Lemonade docs list Fedora 43 with .rpm. Point at their
  # latest release + install. Likely via dnf copr until they ship to
  # the main archive.
  emit "error" "Fedora install not yet implemented in this plugin. See https://lemonade-server.ai/install_options.html#fedora"
  return 1
}

install_macos() {
  emit "start" "macOS detected"
  # Lemonade macOS beta ships a .pkg installer from their github.
  # Defer to manual install for now — macOS NPU story is early.
  emit "error" "macOS install not yet implemented in this plugin. See https://lemonade-server.ai/install_options.html#macos"
  return 1
}

main() {
  local os_triple
  os_triple="$(detect_os)"
  local platform os_id os_version
  IFS=: read -r platform os_id os_version <<<"$os_triple"

  case "$platform:$os_id" in
    linux:ubuntu) install_ubuntu "$os_version" ;;
    linux:arch)   install_arch ;;
    linux:fedora) install_fedora ;;
    macos:*)      install_macos ;;
    *)
      emit "error" "Unsupported platform: $os_triple"
      exit 1
      ;;
  esac
}

main "$@"
