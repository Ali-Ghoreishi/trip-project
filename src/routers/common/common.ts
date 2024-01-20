import express from 'express';
const router = express.Router();

import { testController } from '../../controllers/common/test';


router.post('/test', testController.post);
router.get('/test', testController.get);


export default router;
