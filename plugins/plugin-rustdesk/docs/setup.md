# RustDesk Server Setup

RustDesk is a self-hosted remote desktop solution. This plugin manages the RustDesk signal server (hbbs) and relay server (hbbr) via the Aionima dashboard.

## Server Components

- **Signal Server (hbbs)** — handles client registration, ID assignment, and connection brokering
- **Relay Server (hbbr)** — relays traffic when direct P2P connections fail

## Client Configuration

To connect a RustDesk client to this server:

1. Open RustDesk on the client device
2. Go to **Settings > Network**
3. Set **ID/Relay Server** to your server's IP address
4. Set **Key** to the contents of the server's public key

## Service Management

Use the dashboard's **System Services** section to start, stop, and restart the RustDesk services. Service logs are available in the dashboard log viewer.

## Firewall Ports

RustDesk requires these ports:

| Port | Protocol | Purpose |
|------|----------|---------|
| 21115 | TCP | NAT type test |
| 21116 | TCP/UDP | Signaling (hbbs) |
| 21117 | TCP | Relay (hbbr) |
| 21118 | TCP | WebSocket |
| 21119 | TCP | WebSocket |
