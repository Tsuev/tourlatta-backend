import {Route, Guide} from '../models/index.js';

export const createRoute = async (req, res) => {
  try {
    const { title, description, path, guideId } = req.body;

    const newRoute = await Route.create({ title, description, path, adminId: req.user.id });
    
    if(guideId) {
      const guide = await Guide.findByPk(guideId);
      if(guide) {
        newRoute.addGuides(guideId);
      } else {
        return res.status(400).json({ error: 'Гида которого вы хотите добавить не существует' });
      }
    }
    return res.status(200).json(newRoute);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.findAll( {
      where: { adminId: req.user.id },
      include: [
        {
          model: Guide,
          as: 'guides',
          attributes: { exclude: ['guide_route'] }, // Убираем guide_route из выдачи
          through: { attributes: [] }, // Убираем поля из промежуточной таблицы guide_route
        },
      ]});
    res.status(200).json(routes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRouteById = async (req, res) => {
  try {
    const { id } = req.params;
    const route = await Route.findByPk(id);
    if (route) {
      res.status(200).json(route);
    } else {
      res.status(400).json({ error: 'Маршрут не найден' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getRouteByGuideId = async (req, res) => {
  try {
    const guideId  = req.user.id;

    const routes = await Route.findAll({
      include: [
        {
          model: Guide,
          as: 'guides',
          where: { id: guideId }, // Фильтрация маршрутов, в которых есть указанный гид
          through: { attributes: [] }, // Исключает данные из промежуточной таблицы
        },
      ],
    });

    if (routes) {
      res.status(200).json(routes);
    } else {
      res.status(400).json({ error: 'Маршруты не найден' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
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
      res.status(400).json({ error: 'Маршрут не найден' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const route = await Route.findByPk(id);
    if (route) {
      await route.destroy();
      res.status(200).json({
        message: 'Маршрут удален',
      });
    } else {
      res.status(400).json({ error: 'Маршрут не найден' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteGuideFromRoute = async (req, res) => {
 try {
   const { routeId, guideId } = req.body;

   const route = await Route.findByPk(routeId);
      if (!route) {
        return res.status(400).json({ error: 'Маршрут не найден' });
      }
      const guide = await Guide.findByPk(guideId);
      if (!guide) {
        return res.status(400).json({ error: 'Гид не найден' });
      }
      await route.removeGuide(guide);
      return res.status(200).json({ message: 'Гид успешно удален из маршрута' });
 } catch (error) {
   res.status(500).json({ error: error.message });
 }
};

export const updateGuidesInRoute = async (req, res) => {
  try {
    const { routeId, guideIds } = req.body;

    const route = await Route.findByPk(routeId);
    if (!route) {
      return res.status(400).json({ error: 'Маршрут не найден' });
    }

    if (!Array.isArray(guideIds) || guideIds.length === 0) {
      await route.setGuides([]); // Убираем всех гидов
      return res.status(200).json({ message: 'Все гиды удалены из маршрута' });
    }

    const guides = await Guide.findAll({ where: { id: guideIds } });

    const foundGuideIds = guides.map(g => g.id);
    const missingGuideIds = guideIds.filter(id => !foundGuideIds.includes(id));

    if (missingGuideIds.length > 0) {
      return res.status(400).json({ error: `Некоторые гиды не найдены: ${missingGuideIds.join(', ')}` });
    }

    // Устанавливаем новых гидов (заменяем существующих)
    await route.setGuides(guides);

    return res.status(200).json({ message: 'Гиды успешно обновлены' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};