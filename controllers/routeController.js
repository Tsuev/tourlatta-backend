import {Route, Guide} from '../models/index.js';

/**
 * Создать новый маршрут
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 */
export const createRoute = async (req, res) => {
  try {
    const { title, description, path } = req.body;
    const newRoute = await Route.create({ title, description, path });
    res.status(200).json(newRoute);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Получить все маршруты
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 */
export const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.findAll( {include: [
        {
          model: Guide,
        },
      ]});
    res.status(200).json(routes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Получить маршрут по ID
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 */
export const getRouteById = async (req, res) => {
  try {
    const { id } = req.params;
    const route = await Route.findByPk(id);
    if (route) {
      res.status(200).json(route);
    } else {
      res.status(404).json({ error: 'Маршрут не найден' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Обновить маршрут по ID
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 */
export const updateRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, path } = req.body;

    const route = await Route.findByPk(id);
    if (route) {
      route.title = title || route.title;
      route.description = description || route.description;
      route.path = path || route.path;

      await route.save();
      res.status(200).json(route);
    } else {
      res.status(404).json({ error: 'Маршрут не найден' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Удалить маршрут по ID
 * @param {Object} req - объект запроса
 * @param {Object} res - объект ответа
 */
export const deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const route = await Route.findByPk(id);
    if (route) {
      await route.destroy();
      res.status(200).end();
    } else {
      res.status(404).json({ error: 'Маршрут не найден' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};