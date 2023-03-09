import express from 'express';

// Controllers
import { getAllTasks, createTask, updateTaskStatus, updateTask, deleteTask } from '../controllers/task.controller';

const router = express.Router();

// /task/ -> GET
router.get('/', getAllTasks);

// /task/ -> POST
router.post('/', createTask);

// /task/ -> PUT
router.put('/', updateTask);

// /task/:id/ -> PATCH
router.patch('/:id', updateTaskStatus);

// /task/ -> DELETE
router.delete('/:id', deleteTask);

export default router;