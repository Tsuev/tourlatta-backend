// controllers/guideController.js
import Guide from '../models/Guide.js';



export const createGuide = async (req, res) => {
  try {
    const { title, phone, color } = req.body;
    const newGuide = await Guide.create({ title, phone, color });
    res.status(200).json(newGuide);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получить всех гидов
export const getAllGuides = async (req, res) => {
  try {
    const guides = await Guide.findAll();
    res.status(200).json(guides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получить гида по ID
export const getGuideById = async (req, res) => {
  try {
    const { id } = req.params;
    const guide = await Guide.findByPk(id);
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
    const { title, phone, color } = req.body;
    const guide = await Guide.findByPk(id);

    if (guide) {
      guide.title = title;
      guide.phone = phone;
      guide.color = color;
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
