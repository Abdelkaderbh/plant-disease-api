import { Router } from 'express';
import PlantController from '../controllers/PlantController';

const router = Router();

router.get('/plants', PlantController.getAllPlants);
router.get('/plants/:id', PlantController.getPlantById);
router.post('/plants', PlantController.createPlant);
router.put('/plants/:id', PlantController.updatePlant);
router.delete('/plants/:id', PlantController.deletePlant);

export default router;