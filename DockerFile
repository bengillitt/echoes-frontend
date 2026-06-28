# Stage 1: Build the application
FROM oven/bun:1-alpine AS builder
WORKDIR /app
COPY package*.json bun.lockb* ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# Stage 2: Run the application
FROM oven/bun:1-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only what is strictly necessary to run the built app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["bun", "run", "start"]