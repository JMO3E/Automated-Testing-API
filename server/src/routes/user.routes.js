import express from 'express';
import userController from '../controllers/user.controller.js';

const router = express.Router();

router.get('/users', userController.getUser);        
router.get('/users/:id', userController.getUserById);
router.post('/users/create-user', userController.createUser);
router.put('/users/update-user/:id', userController.updateUser);
router.delete('/users/delete-user/:id', userController.deleteUser);

export default router;