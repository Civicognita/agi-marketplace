import { createPlugin } from "@aionima/sdk";
import { kAnalyst } from "./prompts/analyst.js";
import { kCryptologist } from "./prompts/cryptologist.js";
import { kLibrarian } from "./prompts/librarian.js";
import { kLinguist } from "./prompts/linguist.js";
import { analystStandalone } from "./prompts/analyst-standalone.js";
import { researcher } from "./prompts/researcher.js";
import { scribe } from "./prompts/scribe.js";

export default createPlugin({
  async activate(api) {
    api.registerWorker(kAnalyst);
    api.registerWorker(kCryptologist);
    api.registerWorker(kLibrarian);
    api.registerWorker(kLinguist);
    api.registerWorker(analystStandalone);
    api.registerWorker(researcher);
    api.registerWorker(scribe);
  },
});
