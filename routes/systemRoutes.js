import express from 'express';
import {
    createAdmin
} from '../controllers/systemController.js';

const router = express.Router();

router.post('/add', createAdmin);


export default router;
