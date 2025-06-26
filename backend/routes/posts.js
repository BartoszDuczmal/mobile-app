import express from 'express';
import create from '../controllers/posts/create.js';
import fetchPosts from '../controllers/posts/fetchPosts.js';
import like from '../controllers/posts/like.js';
import show from '../controllers/posts/show.js';

const router = express.Router();

router.get('/', fetchPosts);
router.post('/', create);
router.post('/:id', show);
router.post('/:id/likes', like);

export default router;