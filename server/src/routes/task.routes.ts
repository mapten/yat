import express from 'express';
import { body, param } from 'express-validator';

// Controllers
import { fetchUserTasks, createTask, updateTaskStatus, updateTask, deleteTask, syncTasks } from '../controllers/task.controller';

const router = express.Router();

// /task/:userid -> GET
router.get('/:userid',
  param('userid').escape(),
fetchUserTasks);

// /task/ -> POST
router.post('/',
  body('displayName').trim().escape(),
  body('priority').isInt(),
  body('done').isBoolean(),
  body('userId').trim().escape(),
  body('id').trim().escape(),
createTask);

// /task/ -> PUT
router.put('/',
  body('displayName').trim().escape(),
  body('priority').isInt(),
  body('done').isBoolean(),
  body('userId').trim().escape(),
  body('id').trim().escape(),
updateTask);

// /task/:id/ -> PATCH
router.patch('/:id',
  param('id').escape(),
  body('done').isBoolean(),
updateTaskStatus);

// /task/ -> DELETE
router.delete('/:id',
  param('id').escape(),
deleteTask);

// /task/sync/:userid -> POST
router.post('/sync/:userid',
  param('userid').escape(),
  body().isArray(),
  body('*.displayName').trim().escape(),
  body('*.priority').isInt(),
  body('*.done').isBoolean(),
  body('*.userId').trim().escape(),
  body('*.id').trim().escape(),
syncTasks);

export default router;