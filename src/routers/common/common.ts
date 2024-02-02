import { PaymentController } from './../../controllers/common/index';
import express from 'express';
const router = express.Router();

import { testController } from '../../controllers/common/test';


router.post('/test', testController.post);
router.get('/test', testController.get);

//* Payment
router.post('/payment/verify', PaymentController.verify);


export default router;
