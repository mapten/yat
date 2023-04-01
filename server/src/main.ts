import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieSesion from 'cookie-session';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Connect to MongoDB
import { mongoConnect } from './dal/connector';

//Routes
import taskRoutes from './routes/task.routes';
import authRoutes from './routes/auth.routes';
import genericRoutes from './routes/generic.routes';
import tokenRoutes from './routes/token.routes';

// Controllers
import { verifyCsrfToken, verifyAuthToken } from './controllers/token.controller';

dotenv.config();

const PORT = process.env.PORT || 3001;

export const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
  exposedHeaders: ["set-cookie"]
}));
app.use(express.json());
app.use(helmet());
const COOKIE_PARSER_SECRET = process.env.COOKIE_PARSER_SECRET as string;
app.use(cookieParser(COOKIE_PARSER_SECRET));

const isProduction = process.env.NODE_ENV as string === 'production';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});

const COOKIE_SESSION_SECRET = process.env.COOKIE_SESSION_SECRET as string;
app.use(cookieSesion({
  name: 'session',
  secret: COOKIE_SESSION_SECRET,
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

if (isProduction) {
  app.use(limiter);
  app.set('trust proxy', 1); // TODO: test this in production
}

app.use('/token', tokenRoutes);
app.use('/auth', authRoutes);
app.use('/generic', verifyCsrfToken, verifyAuthToken, genericRoutes);
app.use('/task', verifyCsrfToken, verifyAuthToken, taskRoutes);

mongoConnect(() => {
  console.log('listening to port 3001');
  app.listen(PORT);
});