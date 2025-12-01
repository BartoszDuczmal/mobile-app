import express from 'express';
import myShow from './../controllers/profile/myShow.js';
import userShow from './../controllers/profile/show.js';

const router = express.Router();

router.post('/myShow', myShow);
router.post('/show', userShow);
export default router;