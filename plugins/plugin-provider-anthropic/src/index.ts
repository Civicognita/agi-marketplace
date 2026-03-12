/**
 * plugin-provider-anthropic — Anthropic (Claude) API provider.
 *
 * Registers a settings page for configuring the Anthropic API key and default model.
 */

import type { AionimaPlugin, AionimaPluginAPI } from "@aionima/plugins";

const plugin: AionimaPlugin = {
  async activate(api: AionimaPluginAPI): Promise<void> {
    const log = api.getLogger();

    api.registerSettingsPage({
      id: "provider-anthropic",
      label: "Anthropic",
      description: "Claude models — Anthropic API provider",
      icon: "brain",
      position: 10,
      sections: [
        {
          id: "anthropic-credentials",
          label: "Credentials",
          configPath: "bots.providers.anthropic",
          fields: [
            {
              id: "apiKey",
              label: "API Key",
              type: "password",
              placeholder: "sk-ant-...",
              description: "Your Anthropic API key from console.anthropic.com",
            },
            {
              id: "model",
              label: "Default Model",
              type: "model-select",
              provider: "anthropic",
              placeholder: "Select a Claude model...",
              description: "Default model for new conversations",
            },
          ],
        },
      ],
    });

    log.info("provider-anthropic activated");
  },
};

export default plugin;
