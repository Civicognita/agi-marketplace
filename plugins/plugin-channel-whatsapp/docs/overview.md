# WhatsApp Channel

## Overview

WhatsApp Business API channel adapter for Aionima. Supports both Meta Cloud API and 360dialog aggregator endpoints. Webhook payloads are verified with HMAC-SHA256 using the app secret, and the 24-hour messaging window rule is handled via configurable fallback templates.

## Capabilities

| Feature | Supported |
|---------|-----------|
| Text messages | Yes |
| Media (images, documents) | Yes |
| Voice | No |
| Reactions | No |
| Template messages | Yes (fallback) |

## Setup

1. Create a [Meta Business account](https://business.facebook.com/) and add a WhatsApp Business app.
2. Under the app's WhatsApp settings, get the **access token**, **phone number ID**, and **app secret**.
3. Set a **webhook verify token** (any string) and configure it in the Meta developer portal.
4. Open **Settings > Channels > WhatsApp** and fill in all four required fields.

## Configuration Fields

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `accessToken` | Yes | — | WhatsApp Business API access token |
| `phoneNumberId` | Yes | — | Phone number ID from WhatsApp Business Manager |
| `verifyToken` | Yes | — | Webhook verification token |
| `appSecret` | Yes | — | App secret for HMAC signature verification |
| `apiBaseUrl` | No | `https://graph.facebook.com` | Override for 360dialog or other aggregators |
| `apiVersion` | No | v21.0 | Meta Graph API version |
| `rateLimitPerMinute` | No | 20 | Max messages per user per minute |
| `fallbackTemplateName` | No | — | Template to use outside the 24-hour window |
| `fallbackTemplateLanguage` | No | en_US | Language code for the fallback template |

## Notes

- WhatsApp only allows free-form replies within 24 hours of the last user message. Set `fallbackTemplateName` to handle out-of-window conversations.
- Webhook requests are signature-verified before processing; unauthenticated payloads are rejected.
