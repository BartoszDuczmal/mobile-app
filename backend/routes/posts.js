import express from 'express';
import create from '../controllers/posts/create.js';
import edit from '../controllers/posts/edit.js';
import fetch from '../controllers/posts/fetch.js';
import like from '../controllers/posts/like.js';
import remove from '../controllers/posts/remove.js';
import show from '../controllers/posts/show.js';

const router = express.Router();

router.post('/', fetch);
router.post('/create', create);
router.get('/:id', show);
router.post('/:id/like', like);
router.delete('/:id/remove', remove)
router.post('/:id/edit', edit)

export default router;