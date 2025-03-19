import express from 'express'
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './config/swagger.js';
import basicAuth from 'express-basic-auth';
import { Server } from 'socket.io';
import http from "http"


import helmet from 'helmet';
import cors from 'cors'
import "dotenv/config.js";
import { connectToDatabase } from './config/database.js';

import guideRoutes from './routes/guideRoutes.js';
import routeRoutes from './routes/routeRoutes.js';
import systemRoutes from './routes/systemRoutes.js';
import authRoutes from './routes/authRoutes.js'

import {Guide} from './models/index.js';

const app = express()
// const expressWs = ws(app)
let clients = [];

connectToDatabase()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(cookieParser())

const users = [];

app.use('/api/v1/api-docs', basicAuth({
  users: { 'admin': '1234567' }, // Укажите имя пользователя и пароль
  challenge: true, // Включить стандартное окно запроса логина/пароля
}), swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use('/api/v1/guides', guideRoutes);
app.use('/api/v1/routes', routeRoutes);
app.use('/api/v1/admin', systemRoutes);
app.use('/api/v1/auth', authRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://tourlatta.ru'], // Для разработки. Настройте для продакшена.
    methods: ['GET', 'POST'],
  }
});

const adminSockets = {}; // { adminId: socketId }
io.on('connection', (socket) => {
  console.log('Новое соединение:', socket.id);

  // Прием данных от гида
  socket.on('send-location', async ({ userId, location }) => {
    try {
      // Ищем гида по userId, чтобы узнать его adminId
      const guide = await Guide.findByPk(userId);
      if (!guide) {
        console.log('Гид не найден');
        return;
      }

      const adminId = guide.adminId;

      if (adminId && adminSockets[adminId]) {
        // Если админ есть и у него есть сокет, отправляем данные
        io.to(adminSockets[adminId]).emit('receive-location', { userId, location });
        console.log(`Отправка данных администратору с ID ${adminId}`);
      } else {
        console.log('Админ не подключен');
      }
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
    }
  });

  // Сохранение сокет-соединения админа
  socket.on('admin-connect', (adminId) => {
    adminSockets[adminId] = socket.id;
    console.log(`Админ с ID ${adminId} подключился`);
  });

  // Отключение админа
  socket.on('disconnect', () => {
    // Удаляем сокет-соединение админа, когда он отключается
    for (let adminId in adminSockets) {
      if (adminSockets[adminId] === socket.id) {
        delete adminSockets[adminId];
        console.log(`Админ с ID ${adminId} отключился`);
        break;
      }
    }
  });
});

server.listen(5000, () => {
  console.log('сервер запущен');
})