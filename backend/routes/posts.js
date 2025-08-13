import express from 'express';
import create from '../controllers/posts/create.js';
import edit from '../controllers/posts/edit.js';
import fetchPosts from '../controllers/posts/fetchPosts.js';
import isLikedBy from '../controllers/posts/isLikedBy.js';
import like from '../controllers/posts/like.js';
import remove from '../controllers/posts/remove.js';
import show from '../controllers/posts/show.js';

const router = express.Router();

router.get('/', fetchPosts);
router.post('/', create);
router.get('/:id', show);
router.post('/:id/likes', like);
router.post('/:id/isLikedBy', isLikedBy)
router.delete('/:id/remove', remove)
router.post('/:id/edit', edit)

export default router;