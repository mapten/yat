import express from 'express';

// Controllers
import { fetchUserTasks, createTask, updateTaskStatus, updateTask, deleteTask, syncTasks } from '../controllers/task.controller';

const router = express.Router();

// /task/:userid -> GET
router.get('/:userid', fetchUserTasks);

// /task/ -> POST
router.post('/', createTask);

// /task/ -> PUT
router.put('/', updateTask);

// /task/:id/ -> PATCH
router.patch('/:id', updateTaskStatus);

// /task/ -> DELETE
router.delete('/:id', deleteTask);

// /task/sync/:userid -> POST
router.post('/sync/:userid', syncTasks);

export default router;