import { 
  registerUserController,
  verifyEmailController,
  loginController,
  logoutController,
  uploadAvatar,
  updateUserDetails,
  forgotPasswordContoller,
  verifyForgotPasswordOtp,
  resetpassword,
  refreshToken,
  userDetails
} from '../controllers/user.controller.js';

import { Router } from 'express';
import multer from 'multer';
import auth from '../middleware/auth.js';
const userRouter = Router();
// ✅ Use multer memoryStorage for Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Routes
userRouter.post('/register', registerUserController);
userRouter.post('/verify_email', verifyEmailController);
userRouter.post('/login', loginController);
userRouter.get('/logout', auth, logoutController);
userRouter.put('/upload-avatar', auth, upload.single('avatar'), uploadAvatar);
userRouter.put('/update-user', auth, updateUserDetails);
userRouter.put('/forgot-password', forgotPasswordContoller);
userRouter.put('/verify-forgot-password-otp', verifyForgotPasswordOtp);
userRouter.put('/reset-password', resetpassword);
userRouter.post('/refresh-token', refreshToken);
userRouter.get('/user-details', auth, userDetails); 


export default userRouter;
