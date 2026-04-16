# xrdp Remote Desktop Setup

xrdp provides RDP (Remote Desktop Protocol) access to the server's desktop environment. This plugin manages the xrdp service via the Aionima dashboard.

## Connecting

Use any RDP client (Windows Remote Desktop, Remmina, Microsoft Remote Desktop for macOS) to connect:

1. Open your RDP client
2. Enter the server's IP address
3. Log in with your Linux username and password

## Service Management

Use the dashboard's **System Services** section to start, stop, and restart xrdp. The service runs on port 3389 by default.

## Session Types

xrdp supports multiple desktop environments. The `startwm.sh` script determines which desktop environment launches for each RDP session.
