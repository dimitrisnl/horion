# Base image with Bun
FROM oven/bun:1.2.17 AS base

# Install turbo CLI globally using Bun
FROM base AS turbo-cli
RUN bun add -g turbo

# Builder stage
FROM turbo-cli AS builder
WORKDIR /app
# Copy all files
COPY . .
# Use turbo CLI from Bun global install to prune workspaces
RUN turbo prune @horionos/api --docker

# Installer stage
FROM base AS installer
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
# Don't copy the lockfile, allow Bun to generate a fresh one
RUN bun install

# Copy the full source code
COPY --from=builder /app/out/full/ .


# Runner stage (same as installer to avoid another copy)
FROM installer AS runner

# Set the API directory as working directory
WORKDIR /app/apps/api

# Set environment variables
ENV NODE_ENV=production
ENV BUN_ENVIRONMENT=production

# Expose the port the API runs on
EXPOSE 8080

# Run the API directly with Bun
CMD ["bun", "run", "src/index.ts"]
