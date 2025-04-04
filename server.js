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

import {Guide, Admin} from './models/index.js';

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
const adminLocations = {}; // { adminId: { userId: location } }
const adminIntervals = {}; // { adminId: intervalId }

// Интервал отправки данных админам (например, каждые 5 секунд)
const SEND_INTERVAL = 5000; 

io.on('connection', (socket) => {
  console.log('Новое соединение:', socket.id);

  // Обработчик для гидов
  socket.on('send-location', async ({ userId, location }) => {
    try {
      const guide = await Guide.findByPk(userId);
      if (!guide) {
        console.log('Гид не найден');
        return;
      }

      const adminId = guide.adminId;
      if (!adminId) {
        console.log('У гида нет администратора');
        return;
      }

      // Сохраняем локацию для соответствующего админа
      if (!adminLocations[adminId]) {
        adminLocations[adminId] = {};
      }
      adminLocations[adminId][userId] = location;

    } catch (error) {
      console.error('Ошибка при обработке локации:', error);
    }
  });

  // Обработчик подключения админа
  socket.on('admin-connect', async (adminId) => {
    try {
      // Проверяем существование админа в БД
      const admin = await Admin.findByPk(adminId);
      if (!admin) {
        console.log('Администратор не найден');
        return;
      }

      // Сохраняем сокет
      adminSockets[adminId] = socket.id;
      
      // Инициализируем хранилище локаций
      adminLocations[adminId] = adminLocations[adminId] || {};

      // Запускаем интервал отправки данных для этого админа
      if (!adminIntervals[adminId]) {
        adminIntervals[adminId] = setInterval(() => {
          if (adminSockets[adminId] && adminLocations[adminId]) {
            // Отправляем все накопленные локации
            io.to(adminSockets[adminId]).emit('receive-locations', adminLocations[adminId]);
            
            // Очищаем накопленные данные после отправки
            adminLocations[adminId] = {};
          }
        }, SEND_INTERVAL);
      }

      console.log(`Админ ${adminId} подключен`);
    } catch (error) {
      console.error('Ошибка при подключении админа:', error);
    }
  });

  // Обработчик отключения
  socket.on('disconnect', () => {
    // Удаляем админа при отключении
    for (const adminId in adminSockets) {
      if (adminSockets[adminId] === socket.id) {
        // Очищаем связанные ресурсы
        clearInterval(adminIntervals[adminId]);
        delete adminIntervals[adminId];
        delete adminSockets[adminId];
        delete adminLocations[adminId];
        console.log(`Админ ${adminId} отключен`);
        break;
      }
    }
  });
});

server.listen(5000, () => {
  console.log('сервер запущен');
})

