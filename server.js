import express from 'express'
import ws from 'express-ws';

const app = express()
const expressWs = ws(app)

let clients = [];

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

app.listen(5000, ()=> {
    console.log('сервер запущен');  
})