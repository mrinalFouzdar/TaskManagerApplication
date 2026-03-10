import Joi from 'joi';

export const createTaskSchema = Joi.object({
  title: Joi.string().trim().max(255).required().messages({
    'string.empty': 'Title is required',
    'any.required': 'Title is required',
  }),
  description: Joi.string().allow('').optional(),
  status: Joi.string().valid('pending', 'ongoing', 'completed').optional(),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().trim().max(255).optional(),
  description: Joi.string().allow('').optional(),
  status: Joi.string().valid('pending', 'ongoing', 'completed').optional(),
});

export const idParamSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.guid': 'Invalid Task ID format',
    'any.required': 'Task ID is required',
  })
});

export const querySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  search: Joi.string().allow('').optional()
});
