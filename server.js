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
    origin: '*', // Для разработки. Настройте для продакшена.
    methods: ['GET', 'POST'],
  },
  path: '/my-socket'
});

io.on('connection', (socket) => {
  console.log('Новое соединение:', socket.id);

  // Авторизация
  socket.on('authenticate', ({ userId, adminId }) => {
    users[userId] = { socketId: socket.id, adminId };
    console.log(`Пользователь ${userId} связан с администратором ${adminId}`);
  });

  // Прием геоданных от гида
  socket.on('send-location', ({ userId, location }) => {
    //   const admin = Object.values(users).find((user) => user.userId === users[userId].adminId);
    console.log(userId, location)
    //   if (admin) {
    //     io.to(admin.socketId).emit('receive-location', { userId, location });
    //   }
  });

  // Обработчик отключения
  socket.on('disconnect', () => {
    for (const userId in users) {
      if (users[userId].socketId === socket.id) {
        console.log(`Пользователь ${userId} отключен`);
        delete users[userId];
        break;
      }
    }
  });
});

server.listen(5000, () => {
  console.log('сервер запущен');
})