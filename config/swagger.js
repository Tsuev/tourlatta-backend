// config/swagger.js
import swaggerJsDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Tourlatta API',
      version: '1.0.0',
      description: 'API документация для работы с сервисом Tourlatta',
    },
    servers: [
      {
        url: process.env.DEV ? 'http://localhost:5000/api/v1' : 'https://tourlatta.ru/api/v1',
      },
    ],
    components: {
      schemas: {
        Guide: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Уникальный идентификатор гида',
              example: 1
            },
            title: {
              type: 'string',
              description: 'ФИО гида',
              example: 'Зубенко Михаил Петрович'
            },
            phone: {
              type: 'string',
              description: 'Номер телефона гида',
              example: '+7(000)000-00-00'
            },
            color: {
              type: 'string',
              description: 'Цвет маркера на карте',
              example: '#FF5733'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'], // Путь к файлам, где находятся JSDoc комментарии
};



const swaggerSpecs = swaggerJsDoc(swaggerOptions);
export default swaggerSpecs;
