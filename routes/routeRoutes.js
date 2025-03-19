import express from 'express';

import { authenticate, authorize } from '../middlewares/authMiddleware.js';
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

router.post('/add', authenticate, authorize(['ADMIN']), createRoute);
router.get('/get', authenticate, authorize(['ADMIN']), getAllRoutes);
router.get('/get-by-id/:id', authenticate, authorize(['ADMIN']),getRouteById);
router.post('/update/:id', authenticate, authorize(['ADMIN']), updateRoute);
router.post('/delete/:id', authenticate, authorize(['ADMIN']), deleteRoute);
router.post('/add-guides', authenticate, authorize(['ADMIN']), addGuidesToRoute);
router.post('/delete-guide', authenticate, authorize(['ADMIN']), deleteGuideFromRoute);

export default router;
