import express from 'express'
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './config/swagger.js';
import basicAuth from 'express-basic-auth';
import ws from 'express-ws';
import helmet from 'helmet';
import cors from 'cors'
import "dotenv/config.js";
import { connectToDatabase } from './config/database.js';

import guideRoutes from './routes/guideRoutes.js';

const app = express()
const expressWs = ws(app)
let clients = [];

connectToDatabase()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.ws('/get-locations', (ws, req) => {
    console.log('ПОДКЛЮЧЕНИЕ ДЛЯ ПОЛУЧЕНИЯ ЛОКАЦИЙ УСТАНОВЛЕНО');


    clients.push(ws);
    
    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
        console.log('Соединение для получения локаций закрыто');
    });
})

app.ws('/send-location', (ws, req) => {
    console.log('ПОДКЛЮЧЕНИЕ ДЛЯ ОТПРАВКИ ЛОКАЦИИ УСТАНОВЛЕНО');

    ws.on('message', (data) => {
        console.log('Получена локация:', data);
        clients.forEach(client => {
            if (client.readyState === 1) { // Проверяем, что клиент все еще подключен
                client.send(data);
            }
        });
    });

    ws.on('close', () => {
        console.log('Соединение для отправки локации закрыто');
    });
    
})

app.use('/api/v1/api-docs', basicAuth({
    users: { 'admin': '1234567' }, // Укажите имя пользователя и пароль
    challenge: true, // Включить стандартное окно запроса логина/пароля
  }), swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use('/api/v1/guides', guideRoutes);

app.listen(5000, ()=> {
    console.log('сервер запущен');  
})