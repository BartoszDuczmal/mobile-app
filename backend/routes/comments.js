import express from 'express';
import fetch from '../controllers/comments/fetch.js';

const router = express.Router();

router.get('/fetch/:id', fetch)

export default router;