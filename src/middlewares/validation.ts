import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

interface ValidationSchema {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}

export const validate = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error: bodyError } = schema.body?.validate(req.body) || { error: null };
    const { error: queryError } = schema.query?.validate(req.query) || { error: null };
    const { error: paramsError } = schema.params?.validate(req.params) || { error: null };

    if (bodyError || queryError || paramsError) {
      res.status(400).json({
        message: 'Erro de validação',
        details: bodyError?.details || queryError?.details || paramsError?.details,
      });
      return; // Ensure the function returns void
    }

    next();
  };
};