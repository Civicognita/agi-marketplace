import { createPlugin } from "@aionima/sdk";

export default createPlugin({
  async activate(api) {
    api.registerStack({
      id: "stack-nuxt",
      label: "Nuxt",
      description: "Vue.js framework with SSR, file-based routing, and auto-imports",
      category: "framework",
      projectCategories: ["web"],
      requirements: [
        { id: "node", label: "Node.js Runtime", type: "expected" },
        { id: "nuxt", label: "Nuxt", type: "provided" },
        { id: "vue", label: "Vue.js", type: "provided" },
      ],
      containerConfig: {
        image: "node:22-alpine",
        internalPort: 3000,
        shared: false,
        volumeMounts: (ctx) => [
          `${ctx.projectPath}:/app:Z`,
        ],
        env: (ctx) => ({
          PORT: "3000",
          NODE_ENV: ctx.mode,
          HOSTNAME: "0.0.0.0",
        }),
        command: (ctx) => {
          if (ctx.mode === "development") {
            return ["npm", "run", "dev"];
          }
          return ["sh", "-c", "npm run build && npm start"];
        },
      },
      installActions: [
        { id: "npm.install", label: "Install Dependencies", command: "npm install" },
      ],
      devCommands: {
        dev: "npm run dev",
        build: "npm run build",
        start: "npm start",
      },
      guides: [
        { title: "Getting Started", content: "Run `npm run dev` to start the development server.\n\nPages live in `pages/` with file-based routing." },
      ],
      tools: [
        { id: "npm-install", label: "npm install", description: "Install dependencies", action: "shell", command: "npm install" },
        { id: "npm-dev", label: "npm run dev", description: "Start dev server", action: "shell", command: "npm run dev" },
        { id: "npm-build", label: "npm run build", description: "Build for production", action: "shell", command: "npm run build" },
        { id: "npm-start", label: "npm start", description: "Start production server", action: "shell", command: "npm start" },
      ],
      icon: "globe",
    });
  },
});
