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

emit() {
  printf '{"phase":"lemonade-install","status":"%s","details":"%s"}\n' "$1" "$2"
}

FLM_RELEASE_URL="https://api.github.com/repos/lemonade-sdk/lemonade/releases/latest"

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
      emit "apt" "installing libxrt-npu2 + amdxdna-dkms"
      sudo apt install -y libxrt-npu2 amdxdna-dkms
      ;;
    26.04)
      emit "apt" "installing libxrt-npu2 + amdxdna-dkms (already in archive)"
      sudo apt install -y libxrt-npu2 amdxdna-dkms
      ;;
    *)
      emit "error" "Ubuntu $version is not currently tested. Lemonade officially supports 24.04, 25.10, 26.04."
      return 1
      ;;
  esac

  # FLM .deb — Lemonade's FastFlowLM runtime with NPU support.
  emit "flm" "resolving latest FLM release"
  local flm_url
  flm_url="$(
    curl -sL "$FLM_RELEASE_URL" \
      | grep -oE 'https://[^"]+flm[^"]*_amd64\.deb' \
      | head -1
  )"
  if [ -z "$flm_url" ]; then
    emit "error" "could not resolve FLM .deb URL from GitHub releases"
    return 1
  fi
  emit "flm" "downloading $flm_url"
  local tmp
  tmp="$(mktemp -t flm-XXXXXX.deb)"
  curl -sL -o "$tmp" "$flm_url"
  emit "flm" "installing FLM .deb"
  sudo apt install -y "$tmp"
  rm -f "$tmp"

  emit "done" "Lemonade + FLM installed. REBOOT recommended — new amdxdna-dkms module needs a clean load cycle."
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
