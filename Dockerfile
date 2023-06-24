FROM node:18 as builder-base

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY . ./
RUN pnpm install
RUN pnpm run build

FROM node:18-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

ENV PORT=3000

WORKDIR /app
COPY --from=builder-base /app/build /app
COPY --from=builder-base /app/package.json /app
RUN pnpm install -P

EXPOSE 3000

CMD ["node", "index.js"]
