import * as Joi from 'joi';

export const validationSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development','production').default('development'),
    PORT: Joi.number().default(3000),
    DATABASE_URL: Joi.string().uri().required(),
    IPAYMU_VA: Joi.string().required(),
    IPAYMU_API_KEY: Joi.string().required(),
    IPAYMU_URL: Joi.string().uri().required(),
    JWT_SECRET: Joi.string().min(32).required(),
    JWT_EXPIRES_IN: Joi.string().default('3600s'),
});