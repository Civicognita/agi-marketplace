/**
 * Node.js Runtime Plugin — registers Node.js runtime versions, hosting extensions,
 * and a native Node.js installer for the host machine.
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createPlugin } from "@aionima/sdk";

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

  // Register settings page for runtime management
  api.registerSettingsPage({
    id: "node-runtime",
    label: "Node.js",
    description: "Manage Node.js runtime versions installed on the host machine.",
    icon: "server",
    position: 80,
    sections: [
      {
        id: "node-runtime-manager",
        label: "Node.js Versions",
        type: "runtime-manager",
        language: "node",
        configPath: "plugins.node-runtime",
        fields: [],
      },
    ],
  });

  // ---------------------------------------------------------------------------
  // Stack registrations
  // ---------------------------------------------------------------------------

  api.registerStack({
    id: "stack-node-24",
    label: "Node.js 24 LTS",
    description: "Node.js 24 LTS runtime with npm 11. Sets the container image for Node-based projects.",
    category: "runtime",
    projectCategories: ["app", "web"],
    requirements: [
      { id: "node", label: "Node.js 24", type: "provided" },
      { id: "npm", label: "npm 11", type: "provided" },
    ],
    guides: [{ title: "Getting Started", content: "This runtime stack sets the Node.js version for your project container. The container image `node:24-alpine` provides Node.js 24 and npm 11." }],
    tools: [
      { id: "npm-install", label: "npm install", description: "Install dependencies", action: "shell", command: "npm install" },
      { id: "npm-dev", label: "npm run dev", description: "Start dev server", action: "shell", command: "npm run dev" },
    ],
    icon: "server",
  });

  api.registerStack({
    id: "stack-node-22",
    label: "Node.js 22 LTS",
    description: "Node.js 22 LTS runtime with npm 10.9.",
    category: "runtime",
    projectCategories: ["app", "web"],
    requirements: [
      { id: "node", label: "Node.js 22", type: "provided" },
      { id: "npm", label: "npm 10.9", type: "provided" },
    ],
    guides: [{ title: "Getting Started", content: "Node.js 22 LTS with npm 10.9. Container image: `node:22-alpine`." }],
    tools: [
      { id: "npm-install", label: "npm install", description: "Install dependencies", action: "shell", command: "npm install" },
      { id: "npm-dev", label: "npm run dev", description: "Start dev server", action: "shell", command: "npm run dev" },
    ],
    icon: "server",
  });

  api.registerStack({
    id: "stack-node-20",
    label: "Node.js 20 LTS",
    description: "Node.js 20 LTS runtime with npm 10.8.",
    category: "runtime",
    projectCategories: ["app", "web"],
    requirements: [
      { id: "node", label: "Node.js 20", type: "provided" },
      { id: "npm", label: "npm 10.8", type: "provided" },
    ],
    guides: [{ title: "Getting Started", content: "Node.js 20 LTS with npm 10.8. Container image: `node:20-alpine`." }],
    tools: [
      { id: "npm-install", label: "npm install", description: "Install dependencies", action: "shell", command: "npm install" },
      { id: "npm-dev", label: "npm run dev", description: "Start dev server", action: "shell", command: "npm run dev" },
    ],
    icon: "server",
  });

  log.info("Node.js runtimes registered: 24 (npm 11), 22 (npm 10.9), 20 (npm 10.8)");
  },
});
