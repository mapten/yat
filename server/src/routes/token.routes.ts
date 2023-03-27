import express from 'express';

// Controllers
import { generateCsrfToken } from '../controllers/token.controller';

const router = express.Router();

// /token/csrf-token -> GET
router.get('/csrf-token', generateCsrfToken);

export default router;