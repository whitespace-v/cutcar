FROM library/postgres
COPY prisma/init.sql /docker-entrypoint-initdb.d/
FROM oven/bun:1 AS base
WORKDIR /app
COPY package.json .
FROM base AS install
RUN bun install
COPY . .
ENV NODE_ENV=production
RUN bunx prisma generate
EXPOSE 5000
CMD ["bun", "run", "start"]