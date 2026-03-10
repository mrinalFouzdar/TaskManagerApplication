import { Router } from 'express';
import TaskController from '../controllers/TaskController';
import { validate } from '../middlewares/validate';
import { createTaskSchema, updateTaskSchema, idParamSchema, querySchema } from '../validations/TaskValidation';

const router = Router();

router.post('/', validate(createTaskSchema, 'body'), TaskController.createTask);
router.get('/', validate(querySchema, 'query'), TaskController.getTasks);
router.get('/:id', validate(idParamSchema, 'params'), TaskController.getTaskById);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateTaskSchema, 'body'), TaskController.updateTask);
router.delete('/:id', validate(idParamSchema, 'params'), TaskController.deleteTask);

export default router;
