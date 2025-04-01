import express from 'express';

import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import {
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
  deleteGuideFromRoute,
  updateGuidesInRoute,
  getRouteByGuideId
} from '../controllers/routeController.js';

const router = express.Router();

router.post('/add', authenticate, authorize(['ADMIN']), createRoute);
router.get('/get', authenticate, authorize(['ADMIN']), getAllRoutes);
router.get('/get-by-id/:id', authenticate, getRouteById);
router.post('/update/:id', authenticate, authorize(['ADMIN']), updateRoute);
router.post('/delete/:id', authenticate, authorize(['ADMIN']), deleteRoute);
router.post('/update-guides', authenticate, authorize(['ADMIN']), updateGuidesInRoute);
router.post('/delete-guide', authenticate, authorize(['ADMIN']), deleteGuideFromRoute);

router.get('/get-by-guide/:guideId', authenticate, getRouteByGuideId);

export default router;
