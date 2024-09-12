const Joi = require('joi');

const usersValidationSchema = Joi.object({
    username: Joi.string().min(1).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(1).required(),
});

const createPostValidationSchema = Joi.object({
    title: Joi.string().min(1).max(255).required(),
    content: Joi.string().min(1).required(),
    user_id: Joi.number().integer().required(),
});

const updatePostValidationSchema = Joi.object({
    title: Joi.string().min(1).max(255),
    content: Joi.string().min(1),
    user_id: Joi.number().integer().required(),
    id: Joi.number().integer().required(),
});

module.exports = {
    validateUser: (user) => usersValidationSchema.validate(user),
    validateCreatePost: (post) => createPostValidationSchema.validate(post),
    validateUpdatePost: (post) => updatePostValidationSchema.validate(post),
};