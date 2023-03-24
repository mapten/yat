import express from 'express';

// Controllers
import { login, signIn } from '../controllers/auth.controller';

const router = express.Router();

// /auth/login -> POST
router.post('/login', login);

// /auth/signin -> POST
router.post('/signin', signIn);

export default router;