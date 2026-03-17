import express from 'express';
import add from '../controllers/comments/add.js';
import fetch from '../controllers/comments/fetch.js';
import remove from '../controllers/comments/remove.js';

const router = express.Router();

router.get('/fetch/:id', fetch)
router.post('/add', add)
router.post('/remove', remove)

export default router;