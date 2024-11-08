import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false,  // отключение логирования запросов
    pool: {
      max: 5, // максимальное количество соединений в пуле
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    sequelize.sync({ alter: true }) // `alter: true` изменяет таблицы при необходимости
    .then(() => {
        console.log('Все таблицы синхронизированы');
    })
    .catch((error) => {
        console.error('Ошибка синхронизации базы данных:', error);
    })
    console.log('Подключение к базе данных прошло успешно.');
  } catch (error) {
    console.error('Ошибка при подключении к базе данных:', error);
    process.exit(1); // завершение процесса в случае ошибки
  }
};

export { sequelize, connectToDatabase };
