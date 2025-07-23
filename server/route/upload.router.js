import { Router } from 'express';
import auth from '../middleware/auth.js';
import uploadImageController from '../controllers/uploadImage.controller.js';
import upload from '../middleware/multer.js';

const uploadRouter = Router();

// ✅ CORRECT: pass the middleware function itself
uploadRouter.post("/upload", auth, upload.any('file'), uploadImageController);


export default uploadRouter;
