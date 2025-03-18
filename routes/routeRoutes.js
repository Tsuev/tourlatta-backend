import express from 'express';
import {
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
  deleteGuideFromRoute,
  addGuidesToRoute
} from '../controllers/routeController.js';

const router = express.Router();

router.post('/add', createRoute);
router.get('/get', getAllRoutes);
router.get('/get-by-id/:id', getRouteById);
router.post('/update/:id', updateRoute);
router.post('/delete/:id', deleteRoute);
router.post('/add-guides', addGuidesToRoute);
router.post('/delete-guide', deleteGuideFromRoute);

export default router;
