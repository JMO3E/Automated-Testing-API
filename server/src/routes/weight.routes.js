import express from 'express';
import weightController from '../controllers/weight.controller.js';

const router = express.Router();


router.get('/weight', weightController.getWeight);        
router.get('/weight/:id', weightController.getWeightById);
router.post('/weight/create-weight', weightController.createWeight);
router.put('/weight/update-weight/:id', weightController.updateWeight);
router.delete('/weight/delete-weight/:id', weightController.deleteWeight);

export default router;