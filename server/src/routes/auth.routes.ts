import express from 'express';
import { body, param } from 'express-validator';

// Controllers
import { login, signIn } from '../controllers/auth.controller';

const router = express.Router();

// /auth/login -> POST
router.post('/login',
  body('email').isEmail().normalizeEmail(),
  body('password').trim().escape(),
login);

// /auth/signin -> POST
router.post('/signin',
  body('email').isEmail().normalizeEmail(),
  body('password').trim().escape(),
  body('name').trim().escape(),
signIn);

export default router;