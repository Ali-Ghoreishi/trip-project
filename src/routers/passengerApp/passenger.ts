import express from 'express';

import limiter from '../../middlewares/rateLimit';
import { authMiddleware } from '../../middlewares/authMiddlewares';
import { PassengerController, TripController } from '../../controllers/passengerApp/passenger/index';
// import { UploadFileController } from '../../../controllers/v1/common/index';

const router = express.Router();
router.use(authMiddleware.passenger); // Check Passenger Status - Verify JWT

// //* Token
// router.get('/refresh-token', AuthController.refreshToken);
// router.get('/check-token', /*auth('check-token'),*/ AuthController.check_token);

//* Passenger
router.get('/passenger/dashboard', PassengerController.dashboard);

//* Trip
router.get('/trip/register', TripController.register);



export default router;
