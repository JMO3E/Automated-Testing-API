import express from 'express';
import intensityController from '../controllers/intensity.controller.js';

const router = express.Router();

router.get('/intensity', intensityController.getIntensity);        
router.get('/intensity/:id', intensityController.getIntensityById);
router.post('/intensity/create-intensity', intensityController.createIntensity);
router.put('/intensity/update-intensity/:id', intensityController.updateIntensity);
router.delete('/intensity/delete-intensity/:id', intensityController.deleteIntensity);

export default router;