import express from 'express'
import { Register } from '../controllers/AuthController';
const router = express.Router();


router.post('/signup',Register)


export default router;