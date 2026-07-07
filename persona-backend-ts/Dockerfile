# Stage 1: Build
FROM oven/bun:1-alpine AS builder
WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

# Stage 2: Production
FROM oven/bun:1-alpine AS production
WORKDIR /app



COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/contents ./contents

USER bun

EXPOSE 8080

CMD ["sh", "-c", "bun run dist/index.js"]