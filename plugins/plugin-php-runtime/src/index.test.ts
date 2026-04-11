import { describe, it, expect } from "vitest";
import { testActivate } from "@aionima/sdk/testing";
import plugin from "./index.js";

describe("PHP runtime plugin", () => {
  it("registers 4 runtimes (8.5, 8.4, 8.3, 8.2)", async () => {
    const reg = await testActivate(plugin);
    expect(reg.runtimes).toHaveLength(4);
    const versions = reg.runtimes.map((r) => r.version);
    expect(versions).toContain("8.5");
    expect(versions).toContain("8.4");
    expect(versions).toContain("8.3");
    expect(versions).toContain("8.2");
  });

  it("uses GHCR php-apache images", async () => {
    const reg = await testActivate(plugin);
    for (const rt of reg.runtimes) {
      expect(rt.containerImage).toMatch(/^ghcr\.io\/civicognita\/php-apache:8\.\d$/);
    }
  });

  it("all runtimes listen on port 80", async () => {
    const reg = await testActivate(plugin);
    for (const rt of reg.runtimes) {
      expect(rt.internalPort).toBe(80);
    }
  });
});
