import express from 'express';

import limiter from '../../middlewares/rateLimit';
import { authMiddleware } from '../../middlewares/authMiddlewares';
import { CarController, DriverController } from '../../controllers/driverApp/driver/index';
// import { UploadFileController } from '../../../controllers/v1/common/index';

const router = express.Router();
router.use(authMiddleware.driver); // Check Driver Status - Verify JWT

// //* Token
// router.get('/refresh-token', AuthController.refreshToken);
// router.get('/check-token', /*auth('check-token'),*/ AuthController.check_token);

//* Driver
router.get('/driver/dashboard', DriverController.dashboard);

//* Car
router.post('/car/register', limiter, CarController.registerByDriver);
router.get('/car/get', CarController.get);

export default router;
