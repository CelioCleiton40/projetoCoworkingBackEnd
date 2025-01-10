import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import logger from '../utils/logger';

interface ValidationSchema {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}

const validateSchema = (schema: Joi.ObjectSchema | undefined, data: any, type: string): Joi.ValidationError | null => {
  if (!schema) return null;
  const { error } = schema.validate(data);
  if (error) {
    logger.warn(`Erro de validação no ${type}:`, error.details);
  }
  return error || null;
};

export const validate = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Validação de cada parte (body, query, params)
    const bodyError = validateSchema(schema.body, req.body, 'corpo');
    const queryError = validateSchema(schema.query, req.query, 'query');
    const paramsError = validateSchema(schema.params, req.params, 'parâmetros');

    // Se houver erros de validação, retornamos um erro detalhado
    if (bodyError || queryError || paramsError) {
      const errors = [
        ...(bodyError ? bodyError.details : []),
        ...(queryError ? queryError.details : []),
        ...(paramsError ? paramsError.details : []),
      ];
      res.status(400).json({
        message: 'Erro de validação',
        details: errors,
      });
      return;
    }

    // Se não houver erros, continua a execução
    next();
  };
};
