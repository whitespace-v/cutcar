FROM oven/bun:latest AS base
WORKDIR /app

COPY package*.json ./
COPY bun.lockb ./
RUN bun install

COPY . .

# Генерация Prisma
COPY prisma ./prisma
RUN bunx prisma generate

# Сборка
RUN bun run build 
# Предполагается, что есть скрипт build в package.json

# Запуск приложения
EXPOSE 5000
CMD ["bun", "run", "start"] 
# Предполагается, что есть скрипт start в package.json
