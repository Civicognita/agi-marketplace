/**
 * PHP Runtime Plugin — registers PHP runtime versions, hosting extensions,
 * and container image management for project hosting.
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createPlugin, defineSettings, defineSettingsPage } from "@aionima/sdk";

const execFileAsync = promisify(execFile);

export default createPlugin({
  async activate(api) {
  const log = api.getLogger();

  // PHP 8.5 (latest)
  api.registerRuntime({
    id: "php-8.5",
    label: "PHP 8.5",
    language: "php",
    version: "8.5",
    containerImage: "php:8.5-apache",
    internalPort: 80,
    projectTypes: ["php", "laravel"],
    installable: true,
    dependencies: [
      { name: "composer", version: "2.x", type: "managed" },
    ],
  });

  // PHP 8.4
  api.registerRuntime({
    id: "php-8.4",
    label: "PHP 8.4",
    language: "php",
    version: "8.4",
    containerImage: "php:8.4-apache",
    internalPort: 80,
    projectTypes: ["php", "laravel"],
    installable: true,
    dependencies: [
      { name: "composer", version: "2.x", type: "managed" },
    ],
  });

  // PHP 8.3
  api.registerRuntime({
    id: "php-8.3",
    label: "PHP 8.3",
    language: "php",
    version: "8.3",
    containerImage: "php:8.3-apache",
    internalPort: 80,
    projectTypes: ["php", "laravel"],
    installable: true,
    dependencies: [
      { name: "composer", version: "2.x", type: "managed" },
    ],
  });

  // PHP 8.2
  api.registerRuntime({
    id: "php-8.2",
    label: "PHP 8.2",
    language: "php",
    version: "8.2",
    containerImage: "php:8.2-apache",
    internalPort: 80,
    projectTypes: ["php", "laravel"],
    installable: true,
    dependencies: [
      { name: "composer", version: "2.x", type: "managed" },
    ],
  });

  // Register hosting extension field for PHP version selection
  api.registerHostingExtension({
    pluginId: "aionima-php-runtime",
    fields: [
      {
        id: "runtimeId",
        label: "PHP Version",
        type: "select",
        options: [
          { value: "php-8.5", label: "PHP 8.5 (latest)" },
          { value: "php-8.4", label: "PHP 8.4" },
          { value: "php-8.3", label: "PHP 8.3" },
          { value: "php-8.2", label: "PHP 8.2" },
        ],
        defaultValue: "php-8.5",
        projectTypes: ["php", "laravel"],
      },
    ],
  });

  // Runtime installer — manages container images for project hosting.
  // Does NOT touch the host machine's PHP (projects run in containers).
  api.registerRuntimeInstaller({
    language: "php",

    listAvailable(): string[] {
      return ["8.5", "8.4", "8.3", "8.2"];
    },

    async listInstalled(): Promise<string[]> {
      const installed: string[] = [];
      for (const ver of ["8.5", "8.4", "8.3", "8.2"]) {
        try {
          await execFileAsync("podman", ["image", "exists", `php:${ver}-apache`], { timeout: 10_000 });
          installed.push(ver);
        } catch {
          // Image not pulled yet
        }
      }
      return installed;
    },

    async install(version: string): Promise<void> {
      const valid = ["8.5", "8.4", "8.3", "8.2"];
      if (!valid.includes(version)) throw new Error(`Invalid PHP version: ${version}`);

      log.info(`pulling container image php:${version}-apache`);
      try {
        await execFileAsync("podman", ["pull", `php:${version}-apache`], { timeout: 300_000 });
      } catch (err: unknown) {
        const stderr = (err as { stderr?: string })?.stderr ?? "";
        throw new Error(`Failed to pull php:${version}-apache: ${stderr || (err instanceof Error ? err.message : String(err))}`);
      }
      log.info(`php:${version}-apache pulled successfully`);
    },

    async uninstall(version: string): Promise<void> {
      const valid = ["8.5", "8.4", "8.3", "8.2"];
      if (!valid.includes(version)) throw new Error(`Invalid PHP version: ${version}`);

      log.info(`removing container image php:${version}-apache`);
      try {
        await execFileAsync("podman", ["rmi", `php:${version}-apache`], { timeout: 60_000 });
      } catch (err: unknown) {
        const stderr = (err as { stderr?: string })?.stderr ?? "";
        throw new Error(`Failed to remove php:${version}-apache: ${stderr || (err instanceof Error ? err.message : String(err))}`);
      }
      log.info(`php:${version}-apache removed`);
    },
  });

  // Settings page — version manager + config
  const runtimeSection = defineSettings("php-versions", "Installed Versions")
    .description("Manage PHP container images for project hosting")
    .configPath("runtimes.php")
    .type("runtime-manager")
    .language("php")
    .build();

  const configSection = defineSettings("php-config", "Configuration")
    .description("Default PHP settings for new projects")
    .configPath("runtimes.php")
    .field({
      id: "defaultVersion",
      label: "Default Version",
      type: "select",
      description: "Version used when creating new projects",
      options: [
        { value: "8.5", label: "PHP 8.5" },
        { value: "8.4", label: "PHP 8.4" },
        { value: "8.3", label: "PHP 8.3" },
        { value: "8.2", label: "PHP 8.2" },
      ],
      defaultValue: "8.4",
    })
    .field({
      id: "memoryLimit",
      label: "Memory Limit",
      type: "select",
      description: "PHP memory_limit for development",
      options: [
        { value: "128M", label: "128 MB" },
        { value: "256M", label: "256 MB" },
        { value: "512M", label: "512 MB" },
        { value: "1G", label: "1 GB" },
      ],
      defaultValue: "256M",
    })
    .field({
      id: "displayErrors",
      label: "Display Errors",
      type: "toggle",
      description: "Show PHP errors in browser (development only)",
      defaultValue: true,
    })
    .build();

  api.registerSettingsPage(
    defineSettingsPage("php-settings", "PHP")
      .description("PHP runtime versions and configuration")
      .icon("php")
      .section(runtimeSection)
      .section(configSection)
      .build(),
  );

  log.info("PHP runtimes registered: 8.5, 8.4, 8.3, 8.2");
  },
});
