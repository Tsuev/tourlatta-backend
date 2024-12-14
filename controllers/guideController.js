// controllers/guideController.js
import {Guide, Route} from '../models/index.js';
import crypto from 'crypto'

export const createGuide = async (req, res) => {
  try {
    const { title, phone, color, email } = req.body;

    const password = crypto.randomBytes(8).toString('hex'); // 8 случайных байт
    const newGuide = await Guide.create({ title, phone, color, email, password });

    res.status(200).json(newGuide);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получить всех гидов
export const getAllGuides = async (req, res) => {
  try {
    const guides = await Guide.findAll({include: [
      {
        model: Route,
        as: 'routes',
        attributes: { exclude: ['guide_route'] }, // Убираем guide_route из выдачи
        through: { attributes: [] }, // Убираем поля из промежуточной таблицы guide_route
      },
    ]});
    res.status(200).json(guides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получить гида по ID
export const getGuideById = async (req, res) => {
  try {
    const { id } = req.params;
    const guide = await Guide.findByPk(id, {include: [
      {
        model: Route,
        as: 'routes',
        attributes: { exclude: ['guide_route'] }, // Убираем guide_route из выдачи
        through: { attributes: [] }, // Убираем поля из промежуточной таблицы guide_route
      },
    ]});
    if (guide) {
      res.status(200).json(guide);
    } else {
      res.status(404).json({ error: 'Такого гида не обнаружено' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Обновить гида по ID
export const updateGuide = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, phone, color, email } = req.body;
    const guide = await Guide.findByPk(id);

    if (guide) {
      guide.title = title;
      guide.phone = phone;
      guide.color = color;
      guide.email = email;
      await guide.save();
      res.status(200).json(guide);
    } else {
      res.status(404).json({ error: 'Такого гида не обнаружено' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Удалить гида по ID
export const deleteGuide = async (req, res) => {
  try {
    const { id } = req.params;
    const guide = await Guide.findByPk(id);
    if (guide) {
      await guide.destroy();
      res.status(200).json({ message: 'Гид удален' });
    } else {
      res.status(404).json({ error: 'Такого гида не обнаружено' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
