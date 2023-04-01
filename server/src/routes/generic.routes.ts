import express from 'express';

// Controllers
import { ping } from '../controllers/generic.controller';

const router = express.Router();

// /generic/ping -> GET
router.get('/ping', ping);

export default router;