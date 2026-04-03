/**
 * PHP Runtime Plugin — registers PHP runtime versions, hosting extensions,
 * and a native PHP installer for the host machine.
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createPlugin } from "@aionima/sdk";

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

  // Register runtime installer for native PHP on the machine
  api.registerRuntimeInstaller({
    language: "php",

    listAvailable(): string[] {
      return ["8.5", "8.4", "8.3", "8.2"];
    },

    async listInstalled(): Promise<string[]> {
      const installed: string[] = [];
      for (const ver of ["8.5", "8.4", "8.3", "8.2"]) {
        try {
          await execFileAsync(`php${ver}`, ["-v"], { timeout: 5000 });
          installed.push(ver);
        } catch {
          // Not installed
        }
      }
      return installed;
    },

    async install(version: string): Promise<void> {
      const valid = ["8.5", "8.4", "8.3", "8.2"];
      if (!valid.includes(version)) throw new Error(`Invalid PHP version: ${version}`);

      // Ensure ondrej/php PPA is present (required for php8.x packages on Ubuntu)
      try {
        await execFileAsync("sudo", ["apt-get", "install", "-y", "software-properties-common"], { timeout: 120_000 });
        await execFileAsync("sudo", ["add-apt-repository", "-y", "ppa:ondrej/php"], { timeout: 120_000 });
      } catch (err: unknown) {
        const stderr = (err as { stderr?: string })?.stderr ?? "";
        throw new Error(`failed to add PHP PPA: ${stderr || (err instanceof Error ? err.message : String(err))}`);
      }

      const packages = [
        `php${version}`,
        `php${version}-common`,
        `php${version}-cli`,
        `php${version}-fpm`,
        `php${version}-mysql`,
        `php${version}-xml`,
        `php${version}-curl`,
        `php${version}-mbstring`,
        `php${version}-zip`,
      ];

      log.info(`installing PHP ${version}: apt-get update`);
      try {
        await execFileAsync("sudo", ["apt-get", "update"], { timeout: 120_000 });
      } catch (err: unknown) {
        const stderr = (err as { stderr?: string })?.stderr ?? "";
        throw new Error(`apt-get update failed: ${stderr || (err instanceof Error ? err.message : String(err))}`);
      }

      log.info(`installing PHP ${version}: apt-get install ${packages.join(" ")}`);
      try {
        await execFileAsync("sudo", ["apt-get", "install", "-y", ...packages], { timeout: 300_000 });
      } catch (err: unknown) {
        const stderr = (err as { stderr?: string })?.stderr ?? "";
        throw new Error(`apt-get install failed for PHP ${version}: ${stderr || (err instanceof Error ? err.message : String(err))}`);
      }
      log.info(`PHP ${version} installed successfully`);
    },

    async uninstall(version: string): Promise<void> {
      const valid = ["8.5", "8.4", "8.3", "8.2"];
      if (!valid.includes(version)) throw new Error(`Invalid PHP version: ${version}`);

      log.info(`uninstalling PHP ${version}`);
      try {
        await execFileAsync("sudo", ["apt-get", "purge", "-y", `php${version}*`], { timeout: 120_000 });
        await execFileAsync("sudo", ["apt-get", "autoremove", "-y"], { timeout: 60_000 });
      } catch (err: unknown) {
        const stderr = (err as { stderr?: string })?.stderr ?? "";
        throw new Error(`uninstall failed for PHP ${version}: ${stderr || (err instanceof Error ? err.message : String(err))}`);
      }
      log.info(`PHP ${version} uninstalled successfully`);
    },
  });

  log.info("PHP runtimes registered: 8.5, 8.4, 8.3, 8.2");
  },
});
