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

export const addGuidesToRoute = async (req, res) => {
  try {
    const { routeId, guideIds } = req.body;
    
    if (!Array.isArray(guideIds) || guideIds.length === 0) {
      return res.status(400).json({ error: 'Передайте массив id гидов' });
    }
    
    const route = await Route.findByPk(routeId);
    if (!route) {
      return res.status(400).json({ error: 'Маршрут не найден' });
    }
    
    const guides = await Guide.findAll({ where: { id: guideIds } });
    if (guides.length !== guideIds.length) {
      return res.status(400).json({ error: 'Один или несколько гидов не найдены' });
    }
    
    await route.addGuides(guides);
    return res.status(200).json({ message: 'Гиды успешно добавлены к маршруту' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
