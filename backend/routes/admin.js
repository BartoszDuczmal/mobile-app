import express from 'express';
import block from '../controllers/admin/block.js';
import unblock from '../controllers/admin/unblock.js';

const router = express.Router();

router.post('/block', block);
router.post('/unblock', unblock);


export default router;