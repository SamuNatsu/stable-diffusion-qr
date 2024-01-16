/// API compose controller module
import joi from 'joi';

import { loggers } from '@/utils/global.util.js';
import { newTask } from '@/services/compose.service.js';

// Body schema
const schema = joi.object({
  sid: joi.string().required(),
  data: joi.string().required(),
  front_col: joi.string().pattern(/^#[0-9a-fA-F]{6}$/).required(),
  back_col: joi.string().pattern(/^#[0-9a-fA-F]{6}$/).required(),
  err_lv: joi.string().allow('L', 'M', 'Q', 'H').required(),
  margin: joi.number().integer().min(1).max(20).required(),
  prompt: joi.string().allow('').required(),
  negative_prompt: joi.string().allow('').required(),
  steps: joi.number().integer().min(1).max(100).required(),
  cfg_scale: joi.number().integer().min(1).max(20).required(),
  seed: joi
    .string()
    .pattern(/^(-1|0|[1-9]\d*)$/)
    .required(),
  weight: joi.number().min(0).max(2).required(),
  mode: joi.number().allow(0, 1, 2).required()
});

// Export module
export default function (req, res) {
  // Validate body
  const { error } = schema.validate(req.body);
  if (error !== undefined) {
    loggers.api.warn(`Invalid compose request: remote={${req.remote}}`, error);
    return res.sendStatus(400);
  }

  // Call service
  return newTask(res, req.body);
}
