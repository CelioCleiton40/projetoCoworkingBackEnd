import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import logger from '../utils/logger'; // Certifique-se de importar seu logger corretamente

interface ValidationSchema {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}

const validateSchema = (schema: Joi.ObjectSchema | undefined, data: any, type: string): Joi.ValidationError | null => {
  if (!schema) return null;
  const { error } = schema.validate(data);
  if (error) logger.warn(`Erro de validação no ${type}:`, error.details);
  return error || null;
};

export const validate = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const bodyError = validateSchema(schema.body, req.body, 'corpo');
    const queryError = validateSchema(schema.query, req.query, 'query');
    const paramsError = validateSchema(schema.params, req.params, 'parâmetros');

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
