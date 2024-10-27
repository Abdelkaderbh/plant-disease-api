import express from 'express'
import { Register,SignIn } from '../controllers/AuthController';
import { authenticateToken } from '../middleware/AuthMiddleware';

const router = express.Router();


router.post('/signup',Register)
router.post('/signin',SignIn)



export default router;