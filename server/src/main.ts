import express from 'express';
import cors from 'cors';

// Connect to MongoDB
import { mongoConnect } from './dal/connector';

//Routes
import taskRoutes from './routes/task.routes';
import authRoutes from './routes/auth.routes';
import genericRoutes from './routes/generic.routes';

// Controllers
import { verifyToken } from './controllers/token.controller';


const PORT = process.env['PORT'] || 3001;

const app = express();

app.use(cors());
app.use(express.json());

app.use('/generic', verifyToken, genericRoutes);
app.use('/auth', authRoutes);
app.use('/task', verifyToken, taskRoutes);


mongoConnect(() => {
  console.log('listening to port 3001');
  app.listen(PORT);
});




