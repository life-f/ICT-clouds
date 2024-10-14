// server.js
const http = require('http');

// Создаем сервер
const server = http.createServer((req, res) => {
  // Устанавливаем заголовки ответа
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  
  // Отправляем ответ
  res.end('Hello, World!\n');
});

// Указываем порт, на котором сервер будет работать
const PORT = 3000;

// Запускаем сервер
server.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
