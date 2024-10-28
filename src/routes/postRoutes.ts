import { Router } from 'express';
import PostController from '../controllers/PostController';
import upload from '../utils/upload';

const router = Router();

router.get('/posts', PostController.getAllPosts);
router.get('/posts/:id', PostController.getPostById);
router.post('/posts', upload.single('photo'), PostController.createPost);
router.put('/posts/:id', upload.single('photo'), PostController.updatePost);
router.delete('/posts/:id', PostController.deletePost);
//router.post('/upload', upload.single('photo'), PostController.uploadPicture);

export default router;