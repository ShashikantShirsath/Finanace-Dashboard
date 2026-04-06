import Joi from 'joi';

// Auth validation schemas
export const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('viewer', 'analyst', 'admin').default('viewer')
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

// Record validation schemas
export const createRecordSchema = Joi.object({
    amount: Joi.number().positive().required(),
    category: Joi.string().required(),
    type: Joi.string().valid('income', 'expense').required(),
    date: Joi.date().optional(),
    description: Joi.string().optional()
});

export const updateRecordSchema = Joi.object({
    amount: Joi.number().positive().optional(),
    category: Joi.string().optional(),
    type: Joi.string().valid('income', 'expense').optional(),
    date: Joi.date().optional(),
    description: Joi.string().optional()
}).min(1); // At least one field must be provided