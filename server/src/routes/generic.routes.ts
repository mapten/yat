import express from 'express';

// Controllers
import { ping } from '../controllers/generic.controller';

const router = express.Router();

// /generic/ping -> PING
router.get('/ping', ping);

export default router;