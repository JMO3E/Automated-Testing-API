import express from 'express';
import nutritionController from '../controllers/nutrition.controller.js';

const router = express.Router();

router.get('/nutrition', nutritionController.getNutrition);        
router.get('/nutrition/:id', nutritionController.getNutritionById);
router.post('/nutrition/create-nutrition', nutritionController.createNutrition);
router.put('/nutrition/update-nutrition/:id', nutritionController.updateNutrition);
router.delete('/nutrition/delete-nutrition/:id', nutritionController.deleteNutrition);

export default router;