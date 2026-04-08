/**
 * Node.js Runtime Plugin — registers Node.js runtime versions, hosting extensions,
 * and a native Node.js installer for the host machine.
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createPlugin, defineSettings, defineSettingsPage } from "@aionima/sdk";

const execFileAsync = promisify(execFile);

export default createPlugin({
  async activate(api) {
  const log = api.getLogger();

  // Node.js 24 LTS (bundled npm 11)
  api.registerRuntime({
    id: "node-24",
    label: "Node.js 24 LTS",
    language: "node",
    version: "24",
    containerImage: "node:24-alpine",
    internalPort: 3000,
    projectTypes: ["node", "nextjs", "nuxt"],
    installable: true,
    dependencies: [
      { name: "npm", version: "11.x", type: "bundled" },
      { name: "corepack", version: "0.32.x", type: "bundled" },
    ],
  });

  // Node.js 22 LTS (bundled npm 10)
  api.registerRuntime({
    id: "node-22",
    label: "Node.js 22 LTS",
    language: "node",
    version: "22",
    containerImage: "node:22-alpine",
    internalPort: 3000,
    projectTypes: ["node", "nextjs", "nuxt"],
    installable: true,
    dependencies: [
      { name: "npm", version: "10.9.x", type: "bundled" },
      { name: "corepack", version: "0.31.x", type: "bundled" },
    ],
  });

  // Node.js 20 LTS (bundled npm 10)
  api.registerRuntime({
    id: "node-20",
    label: "Node.js 20 LTS",
    language: "node",
    version: "20",
    containerImage: "node:20-alpine",
    internalPort: 3000,
    projectTypes: ["node", "nextjs", "nuxt"],
    installable: true,
    dependencies: [
      { name: "npm", version: "10.8.x", type: "bundled" },
      { name: "corepack", version: "0.28.x", type: "bundled" },
    ],
  });

  // Register hosting extension field for Node version selection
  api.registerHostingExtension({
    pluginId: "aionima-node-runtime",
    fields: [
      {
        id: "runtimeId",
        label: "Node Version",
        type: "select",
        options: [
          { value: "node-24", label: "Node.js 24 LTS (npm 11)" },
          { value: "node-22", label: "Node.js 22 LTS (npm 10.9)" },
          { value: "node-20", label: "Node.js 20 LTS (npm 10.8)" },
        ],
        defaultValue: "node-24",
        projectTypes: ["node", "nextjs", "nuxt"],
      },
    ],
  });

  // Register runtime installer for native Node.js on the machine
  api.registerRuntimeInstaller({
    language: "node",

    listAvailable(): string[] {
      return ["24", "22", "20"];
    },

    async listInstalled(): Promise<string[]> {
      const installed: string[] = [];
      try {
        const { stdout } = await execFileAsync("node", ["-v"], { timeout: 5000 });
        const match = stdout.trim().match(/^v(\d+)/);
        if (match?.[1]) {
          installed.push(match[1]);
        }
      } catch {
        // Node not installed
      }
      return installed;
    },

    async install(version: string): Promise<void> {
      const valid = ["24", "22", "20"];
      if (!valid.includes(version)) throw new Error(`Invalid Node.js version: ${version}`);

      log.info(`installing Node.js ${version}: adding NodeSource repository`);
      try {
        await execFileAsync("sudo", [
          "bash", "-c",
          `curl -fsSL https://deb.nodesource.com/setup_${version}.x | sudo -E bash -`,
        ], { timeout: 120_000 });
      } catch (err: unknown) {
        const stderr = (err as { stderr?: string })?.stderr ?? "";
        throw new Error(`NodeSource setup failed for Node.js ${version}: ${stderr || (err instanceof Error ? err.message : String(err))}`);
      }

      log.info(`installing Node.js ${version}: apt-get install nodejs`);
      try {
        await execFileAsync("sudo", ["apt-get", "install", "-y", "nodejs"], { timeout: 120_000 });
      } catch (err: unknown) {
        const stderr = (err as { stderr?: string })?.stderr ?? "";
        throw new Error(`apt-get install failed for Node.js ${version}: ${stderr || (err instanceof Error ? err.message : String(err))}`);
      }
      log.info(`Node.js ${version} installed successfully`);
    },

    async uninstall(version: string): Promise<void> {
      const valid = ["24", "22", "20"];
      if (!valid.includes(version)) throw new Error(`Invalid Node.js version: ${version}`);

      log.info(`uninstalling Node.js ${version}`);
      try {
        await execFileAsync("sudo", ["apt-get", "purge", "-y", "nodejs"], { timeout: 60_000 });
        await execFileAsync("sudo", ["apt-get", "autoremove", "-y"], { timeout: 60_000 });
      } catch (err: unknown) {
        const stderr = (err as { stderr?: string })?.stderr ?? "";
        throw new Error(`uninstall failed for Node.js ${version}: ${stderr || (err instanceof Error ? err.message : String(err))}`);
      }
      log.info(`Node.js ${version} uninstalled successfully`);
    },
  });

  // Settings page — version manager + config
  const runtimeSection = defineSettings("node-versions", "Installed Versions")
    .description("Manage Node.js versions installed on this machine")
    .configPath("runtimes.node")
    .type("runtime-manager")
    .language("node")
    .build();

  const configSection = defineSettings("node-config", "Configuration")
    .description("Default Node.js settings for new projects")
    .configPath("runtimes.node")
    .field({
      id: "defaultVersion",
      label: "Default Version",
      type: "select",
      description: "Version used when creating new projects",
      options: [
        { value: "24", label: "Node.js 24 LTS" },
        { value: "22", label: "Node.js 22 LTS" },
        { value: "20", label: "Node.js 20 LTS" },
      ],
      defaultValue: "22",
    })
    .field({
      id: "packageManager",
      label: "Package Manager",
      type: "select",
      description: "Default package manager for new projects",
      options: [
        { value: "npm", label: "npm" },
        { value: "pnpm", label: "pnpm" },
        { value: "yarn", label: "Yarn" },
        { value: "bun", label: "Bun" },
      ],
      defaultValue: "pnpm",
    })
    .build();

  api.registerSettingsPage(
    defineSettingsPage("node-settings", "Node.js")
      .description("Node.js runtime versions and configuration")
      .icon("node")
      .section(runtimeSection)
      .section(configSection)
      .build(),
  );

  log.info("Node.js runtimes registered: 24 (npm 11), 22 (npm 10.9), 20 (npm 10.8)");
  },
});
