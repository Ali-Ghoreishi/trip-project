import express from 'express';
const router = express.Router();

import portalRouter from './portal/index';
// import driverAppRouter from './driverApp/index';
// import passengerAppRouter from './passengerApp/index';
import commonRouter from './common/common';

router.use('/api/portal', portalRouter);
// router.use('/api/driver-app', driverAppRouter);
// router.use('/api/passenger-app', passengerAppRouter);
router.use('/api/common', commonRouter);

export default router;

