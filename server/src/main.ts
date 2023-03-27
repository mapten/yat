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
import { verifyCsrfToken, verifyToken } from './controllers/token.controller';


dotenv.config();

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
  exposedHeaders: ["set-cookie"]
}));
app.use(express.json());
app.use(helmet());
const COOKIE_PARSER_SECRET = process.env.COOKIE_PARSER_SECRET!;
app.use(cookieParser(COOKIE_PARSER_SECRET));


const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);


const COOKIE_SESSION_SECRET = process.env.COOKIE_SESSION_SECRET!;
app.use(cookieSesion({
  name: 'session',
  secret: COOKIE_SESSION_SECRET,
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));


const isProduction = process.env.NODE_ENV! === 'production';

if (isProduction) {
  //app.set('trust proxy', 1); // TODO: test this in production
}

app.use('/token', tokenRoutes);
app.use('/auth', verifyCsrfToken, authRoutes);
app.use('/generic', verifyCsrfToken, verifyToken, genericRoutes);
app.use('/task', verifyCsrfToken, verifyToken, taskRoutes);


mongoConnect(() => {
  console.log('listening to port 3001');
  app.listen(PORT);
});




