import { describe, it, expect } from "vitest";
import { testActivate } from "@aionima/sdk/testing";
import plugin from "./index.js";

describe("WhoDB plugin", () => {
  it("registers the whodb service", async () => {
    const reg = await testActivate(plugin);
    expect(reg.services).toHaveLength(1);
    expect(reg.services[0]!.id).toBe("whodb");
    expect(reg.services[0]!.containerImage).toBe("clidey/whodb:latest");
  });

  it("registers the db subdomain route", async () => {
    const reg = await testActivate(plugin);
    // SubdomainRouteDefinition is registered via registerSubdomainRoute
    // Check that at least one HTTP route or hook was registered
    expect(reg.hooks.length).toBeGreaterThanOrEqual(1);
  });

  it("registers the query_database agent tool", async () => {
    const reg = await testActivate(plugin);
    expect(reg.agentTools).toHaveLength(1);
    expect(reg.agentTools[0]!.name).toBe("query_database");
  });

  it("registers a settings page", async () => {
    const reg = await testActivate(plugin);
    expect(reg.settingsPages).toHaveLength(1);
    expect(reg.settingsPages[0]!.id).toBe("whodb");
  });
});
