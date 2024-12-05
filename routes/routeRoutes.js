import express from 'express';
import {
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
} from '../controllers/routeController.js';

const router = express.Router();

router.post('/add', createRoute);
router.get('/get', getAllRoutes);
router.get('/get-by-id/:id', getRouteById);
router.put('/update/:id', updateRoute);
router.delete('/delete/:id', deleteRoute);

export default router;
