FROM oven/bun:latest AS base
WORKDIR /app

# Установка зависимостей
COPY package*.json ./
COPY bun.lockb ./
RUN bun add -g dotenv-cli 
RUN bun install

# Копирование исходного кода
COPY . .

# Сборка приложения
RUN bun run build

# Запуск приложения
EXPOSE 3000
CMD ["bun", "run", "start"]
