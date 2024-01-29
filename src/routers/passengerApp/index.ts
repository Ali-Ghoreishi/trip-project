import express from 'express';
const router = express.Router();

import passengerRouter from './passenger';
import authRouter from './auth';

router.use('/app', passengerRouter);
router.use('/auth', authRouter);

export default router;
