import express from 'express';
import create from '../controllers/posts/create.js';
import fetchPosts from '../controllers/posts/fetchPosts.js';
import isLikedBy from '../controllers/posts/isLikedBy.js';
import like from '../controllers/posts/like.js';
import show from '../controllers/posts/show.js';

const router = express.Router();

router.get('/', fetchPosts);
router.post('/', create);
router.get('/:id', show);
router.post('/:id/likes', like);
router.post('/:id/isLikedBy', isLikedBy)

export default router;