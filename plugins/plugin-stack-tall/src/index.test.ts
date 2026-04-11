import { describe, it, expect } from "vitest";
import { testActivate } from "@aionima/sdk/testing";
import plugin from "./index.js";

describe("TALL stack plugin", () => {
  it("registers the stack-tall stack", async () => {
    const reg = await testActivate(plugin);
    expect(reg.stacks).toHaveLength(1);
    expect(reg.stacks[0]!.id).toBe("stack-tall");
  });

  it("expects laravel (dependency on Laravel stack)", async () => {
    const reg = await testActivate(plugin);
    const tall = reg.stacks[0]!;
    const expected = tall.requirements.filter((r) => r.type === "expected");
    expect(expected).toHaveLength(1);
    expect(expected[0]!.id).toBe("laravel");
  });

  it("does NOT provide laravel (no conflict with Laravel stack)", async () => {
    const reg = await testActivate(plugin);
    const tall = reg.stacks[0]!;
    const provided = tall.requirements.filter((r) => r.type === "provided");
    const provideIds = provided.map((r) => r.id);
    expect(provideIds).not.toContain("laravel");
    expect(provideIds).toContain("livewire");
    expect(provideIds).toContain("tailwind");
    expect(provideIds).toContain("alpine-js");
    expect(provideIds).toContain("vite");
  });

  it("has installActions for Livewire, Tailwind, and Alpine", async () => {
    const reg = await testActivate(plugin);
    const tall = reg.stacks[0]!;
    expect(tall.installActions).toBeDefined();
    expect(tall.installActions!.length).toBeGreaterThanOrEqual(3);
    const ids = tall.installActions!.map((a) => a.id);
    expect(ids).toContain("composer.require.livewire");
    expect(ids).toContain("npm.install.tailwind");
    expect(ids).toContain("npm.install.alpinejs");
  });

  it("has no containerConfig (inherits from Laravel)", async () => {
    const reg = await testActivate(plugin);
    const tall = reg.stacks[0]!;
    expect(tall.containerConfig).toBeUndefined();
  });

  it("targets app and web project categories", async () => {
    const reg = await testActivate(plugin);
    const tall = reg.stacks[0]!;
    expect(tall.projectCategories).toContain("app");
    expect(tall.projectCategories).toContain("web");
  });
});
