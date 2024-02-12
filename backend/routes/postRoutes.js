import express  from 'express';
import protectedRoutes from '../middlewares/protectRoutes.js';
import {createPosts,getPosts,delPosts,likeUnlikePosts,reply,getFeedPosts,getUserPosts} from '../controllers/postController.js';



const router2 = express.Router();

// GET route for posts
router2.post('/create',protectedRoutes,createPosts);
router2.get('/:id',getPosts);
router2.get("/user/:username", getUserPosts);
router2.delete('/:id',protectedRoutes,delPosts);
router2.post('/like/:id',protectedRoutes,likeUnlikePosts);
router2.post('/reply/:id',protectedRoutes,reply);
router2.get('/get/feed',protectedRoutes,getFeedPosts);

export default router2;
