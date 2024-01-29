import express from 'express';
const router = express.Router();

import driverRouter from './driver';
import authRouter from './auth';

router.use('/app', driverRouter);
router.use('/auth', authRouter);

export default router;
