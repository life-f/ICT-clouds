# Базовый образ
FROM node:14

# Указываем рабочую директорию
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json в контейнер
COPY package*.json ./

# Установка совместимой версии npm
RUN npm install -g npm@6  # Устанавливаем npm версии 6.x

# Установка зависимостей
RUN npm install

# Копируем все файлы приложения в контейнер
COPY . .

# Команда по умолчанию
CMD ["npm", "start"]
