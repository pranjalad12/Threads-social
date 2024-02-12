import express from 'express';
// import {signup,login} from '../controllers/userController.js';
import { signup, login,logout,followUnfollowUser,updateProfile,getProfile } from '../controllers/userController.js';
import protectedRoutes from '../middlewares/protectRoutes.js';

const router = express.Router();
// Signup route
router.get("/profile/:query", getProfile);
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/follow/:id',protectedRoutes, followUnfollowUser);
router.post('/updateProfile/:id',protectedRoutes, updateProfile);
export default router;
