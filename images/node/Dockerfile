# Aionima Node.js Runtime Image
# Alpine base with build tools for native npm modules.
# Build: podman build --build-arg NODE_VERSION=22 -t ghcr.io/civicognita/node:22 .

ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-alpine

# Build tools for native npm modules (node-gyp, sharp, bcrypt, etc.)
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git \
    curl

# Enable corepack for pnpm/yarn version management
RUN corepack enable

WORKDIR /app

EXPOSE 3000
