// routes/guideRoutes.js
import express from 'express';
import {
  createGuide,
  getAllGuides,
  getGuideById,
  updateGuide,
  deleteGuide,
} from '../controllers/guideController.js';

const router = express.Router(); 

/**
 * Создать нового гида
 * @async
 * @function createGuide
 * @param {Object} req - Объект запроса
 * @param {Object} req.body - Данные тела запроса
 * @param {string} req.body.title - ФИО гида
 * @param {string} req.body.phone - Номер телефона гида
 * @param {string} req.body.color - Цвет маркера на карте
 * @param {Object} res - Объект ответа
 * @returns {Promise<void>} - Возвращает JSON с информацией о новом гиде или ошибку
 *
 * @swagger
 * /guides/add:
 *   post:
 *     summary: Создать нового гида
 *     tags: [Гиды]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - phone
 *               - color
 *             properties:
 *               title:
 *                 type: string
 *                 description: ФИО гида
 *                 example: "Зубенко Михаил Петрович"
 *               phone:
 *                 type: string
 *                 description: Телефон гида
 *                 example: "+7(000)000-00-00"
 *               color:
 *                 type: string
 *                 description: Цвет маркера на карте
 *                 example: "#FF5733"
 *     responses:
 *       201:
 *         description: Гид успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Guide'
 *       500:
 *         description: Ошибка сервера
 */
router.post('/add', createGuide);
/**
 * Создать нового гида
 * @async
 * @function createGuide
 * @param {Object} req - Объект запроса
 * @param {Object} req.body - Данные тела запроса
 * @param {string} req.body.title - ФИО гида
 * @param {string} req.body.phone - Номер телефона гида
 * @param {string} req.body.color - Цвет маркера на карте
 * @param {Object} res - Объект ответа
 * @returns {Promise<void>} - Возвращает JSON с информацией о новом гиде или ошибку
 *
 * @swagger
 * /guides/get:
 *   get:
 *     summary: Получение гидов
 *     tags: [Гиды]
 *     responses:
 *       200:
 *         description: Список гидов
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Guide'
 *       500:
 *         description: Ошибка сервера
 */
router.get('/get', getAllGuides);

/**
 * @swagger
 * /guides/get-by-id/{id}:
 *   get:
 *     summary: Получить гида по ID
 *     tags: [Гиды]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Уникальный идентификатор гида
 *     responses:
 *       200:
 *         description: Успешное получение данных гида
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Guide'
 *       404:
 *         description: Гид не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Такого гида не обнаружено
 *       500:
 *         description: Ошибка сервера
 */
router.get('/get-by-id/:id', getGuideById);
/**
 * @swagger
 * /guides/update/{id}:
 *   put:
 *     summary: Обновить данные гида по ID
 *     tags: [Гиды]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Уникальный идентификатор гида
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - phone
 *               - color
 *             properties:
 *               title:
 *                 type: string
 *                 description: Название гида
 *                 example: "Зубенко Максим Сергевич"
 *               phone:
 *                 type: string
 *                 description: Телефон гида
 *                 example: "+1234567890"
 *               color:
 *                 type: string
 *                 description: Цвет маркера на карте
 *                 example: "#FF5733"
 *     responses:
 *       200:
 *         description: Гид успешно обновлён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Guide'
 *       404:
 *         description: Гид не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Такого гида не обнаружено
 *       500:
 *         description: Ошибка сервера
 */
router.put('/update/:id', updateGuide);
/**
 * @swagger
 * /guides/delete/{id}:
 *   delete:
 *     summary: Удалить гида по ID
 *     tags: [Гиды]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Уникальный идентификатор гида
 *     responses:
 *       200:
 *         description: Гид успешно удален
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Guide'
 *       404:
 *         description: Гид не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Такого гида не обнаружено
 *       500:
 *         description: Ошибка сервера
 */
router.delete('/delete/:id', deleteGuide);

export default router;
