// routes/guideRoutes.js
import express from 'express';

import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import {
  createGuide,
  getAllGuides,
  getGuideById,
  updateGuide,
  deleteGuide,
} from '../controllers/guideController.js';


const router = express.Router(); 

router.post('/add', authenticate, authorize(['ADMIN']), createGuide);
router.get('/get', authenticate, authorize(['ADMIN']), getAllGuides);
router.get('/get-by-id/:id', authenticate, authorize(['ADMIN']), getGuideById);
router.post('/update/:id', authenticate, authorize(['ADMIN']), updateGuide);
router.delete('/delete/:id',authenticate, authorize(['ADMIN']), deleteGuide);


export default router;
