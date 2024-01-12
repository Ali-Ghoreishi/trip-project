import express from 'express';
const router = express.Router();

// import limiter from '../../../middlewares/secure';
// import { UploadFileController } from '../../../controllers/v1/common/index';
// import { AuthController } from '../../../controllers/v1/portal/auth/authController';
import {
  UserController,
} from '../../controllers/portal/user/index';
// import { authMiddleware } from '../../../middlewares/authMiddlewares';
// import auth, { getAllAuth } from '../../../middlewares/userAuther';
// router.use(authMiddleware.user); // Check User Status - Verify JWT

// //* Token
// router.get('/refresh-token', AuthController.refreshToken);
// router.get('/check-token', /*auth('check-token'),*/ AuthController.check_token);

router.post('/user/create', /* limiter, auth('create'), */ UserController.create);



export default router;
