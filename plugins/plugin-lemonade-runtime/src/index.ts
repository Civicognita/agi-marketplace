/**
 * agi-lemonade-runtime — local AI server with NPU/GPU/CPU auto-routing.
 *
 * Brings Lemonade (https://github.com/lemonade-sdk/lemonade) online as
 * AGI's default local-LLM backplane. Lemonade speaks OpenAI/Anthropic/
 * Ollama-compatible APIs on port 8000 and auto-routes each model to the
 * best available backend (AMD XDNA 2 NPU via FastFlowLM, GPU via ROCm,
 * CPU via llama.cpp). On first install, picks up the AMD NPU on
 * supported Ryzen AI hardware so all local inference offloads there.
 *
 * This plugin:
 *   - Registers a system service describing Lemonade's install + lifecycle.
 *   - Adds a Settings page for port + local-first preference.
 *   - Does NOT register the LLM provider — that's baked into AGI core
 *     under the "lemonade" type so the router's config.providers["lemonade"]
 *     check just needs the gateway.json entry the settings page writes.
 *
 * Install script lives at src/install.sh and handles Ubuntu 24.04 /
 * 25.10 / 26.04, Arch, Fedora (stub), macOS beta (stub). The plugin
 * cache stages it at ~/.agi/plugins/cache/agi-lemonade-runtime/src/.
 */

import { createPlugin, defineSettingsPage } from "@agi/sdk";
import { homedir } from "node:os";
import { join } from "node:path";

export default createPlugin({
  async activate(api) {
    const log = api.getLogger();

    // -----------------------------------------------------------------------
    // System service — install + lifecycle for Lemonade
    // -----------------------------------------------------------------------
    //
    // The install script ships with this plugin under src/install.sh.
    // AGI's plugin loader stages plugin files at ~/.agi/plugins/cache/
    // <plugin-id>/ so the install command can reference the staged path.

    const installScript = join(
      homedir(),
      ".agi",
      "plugins",
      "cache",
      "agi-lemonade-runtime",
      "src",
      "install.sh",
    );

    api.registerSystemService({
      id: "lemonade-server",
      name: "Lemonade Server",
      description:
        "Local AI server — serves GGUF/ONNX LLMs, auto-selects NPU/GPU/CPU " +
        "backend per model. OpenAI/Anthropic/Ollama-compatible APIs on port 13305.",
      unitName: "lemonade-server.service",
      installedCheck: "command -v lemonade-server || command -v flm",
      installCommand: `bash "${installScript}"`,
      statusCommand: "systemctl --user is-active lemonade-server 2>/dev/null || systemctl is-active lemonade-server 2>/dev/null",
      startCommand: "systemctl --user start lemonade-server 2>/dev/null || sudo systemctl start lemonade-server",
      stopCommand: "systemctl --user stop lemonade-server 2>/dev/null || sudo systemctl stop lemonade-server",
      restartCommand: "systemctl --user restart lemonade-server 2>/dev/null || sudo systemctl restart lemonade-server",
      agentAware: true,
      agentDescription:
        "Lemonade local AI server. When running, LLM traffic routes here by default " +
        "(see router.localFirst). Auto-selects NPU on AMD XDNA 2 hardware, GPU " +
        "via ROCm, or CPU via llama.cpp depending on the loaded model.",
    });

    // -----------------------------------------------------------------------
    // Settings page — connection + local-first preference
    // -----------------------------------------------------------------------

    api.registerSettingsPage(
      defineSettingsPage("lemonade-runtime", "Lemonade")
        .description("Local AI server — NPU/GPU/CPU auto-routing")
        .icon("cpu")
        .position(11) // between Anthropic (10) and Ollama (12)
        .section({
          id: "lemonade-connection",
          label: "Connection",
          configPath: "bots.providers.lemonade",
          fields: [
            {
              id: "baseUrl",
              label: "Base URL",
              type: "text",
              defaultValue: "http://127.0.0.1:13305",
              placeholder: "http://127.0.0.1:13305",
              description: "Lemonade API endpoint. Default is localhost:8000.",
            },
            {
              id: "model",
              label: "Default Model",
              type: "text",
              placeholder: "default",
              description:
                "Default model identifier (matches whatever you've pulled with " +
                "`lemonade pull`). Leave as 'default' to let Lemonade pick.",
            },
          ],
        })
        .section({
          id: "lemonade-routing",
          label: "Routing",
          configPath: "agent.router",
          fields: [
            {
              id: "localFirst",
              label: "Local wins when present",
              type: "toggle",
              defaultValue: true,
              description:
                "When on, every turn routes through Lemonade except when " +
                "cost-mode is 'max' (the explicit 'escalate to paid API' hint). " +
                "Turn off to preserve pre-plugin behavior where API providers " +
                "handle non-local cost-modes even if Lemonade is available.",
            },
          ],
        })
        .build(),
    );

    log.info("agi-lemonade-runtime activated");
  },
});
