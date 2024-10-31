import express from 'express';
import PlantController, { upload } from '../controllers/PlantController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', authenticateToken, upload.single('file'), PlantController.createPlant);
router.get('/', authenticateToken, PlantController.getAllPlants);
router.get('/:id_plant', authenticateToken, PlantController.getPlantById);
router.put('/:id_plant', authenticateToken, PlantController.updatePlant);
router.delete('/:id_plant', authenticateToken, PlantController.deletePlant);

export default router;
