import express from 'express';
const router = express.Router();

// import userRouter from './user';
import authRouter from './auth';

// router.use('/app', userRouter);
router.use('/auth', authRouter);

export default router;
