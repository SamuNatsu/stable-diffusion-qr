/// Stable diffusion config module
import joi from 'joi';

import { loggers } from '@/utils/global.util.js';

// SD_API
let { error, value } = joi
  .string()
  .label('SD_API')
  .uri()
  .required()
  .validate(process.env.SD_API);
if (error !== undefined) {
  loggers.config.fatal('Fail to parse SD_API', error);
  process.exit(1);
}
export const API = value;

// SD_MODEL_NAME
({ error, value } = joi
  .string()
  .label('SD_MODEL_NAME')
  .required()
  .validate(process.env.SD_MODEL_NAME));
if (error !== undefined) {
  loggers.config.fatal('Fail to parse SD_MODEL_NAME', error);
  process.exit(1);
}
export const MODEL_NAME = value;

// SD_MODEL_URL
({ error, value } = joi
  .string()
  .label('SD_MODEL_URL')
  .uri()
  .default(null)
  .validate(process.env.SD_MODEL_URL));
if (error !== undefined) {
  loggers.config.fatal('Fail to parse SD_MODEL_URL', error);
  process.exit(1);
}
export const MODEL_URL = value;

// SD_PREPEND_PROMPT
({ error, value } = joi
  .string()
  .label('SD_PREPEND_PROMPT')
  .allow('')
  .default('')
  .validate(process.env.SD_PREPEND_PROMPT));
if (error !== undefined) {
  loggers.config.fatal('Fail to parse SD_PREPEND_PROMPT', error);
  process.exit(1);
}
export const PREPEND_PROMPT = value;

// SD_PREPEND_NEGATIVE_PROMPT
({ error, value } = joi
  .string()
  .label('SD_PREPEND_NEGATIVE_PROMPT')
  .allow('')
  .default('')
  .validate(process.env.SD_PREPEND_NEGATIVE_PROMPT));
if (error !== undefined) {
  loggers.config.fatal('Fail to parse SD_PREPEND_NEGATIVE_PROMPT', error);
  process.exit(1);
}
export const PREPEND_NEGATIVE_PROMPT = value;

// SD_SAMPLER
({ error, value } = joi
  .string()
  .label('SD_SAMPLER')
  .required()
  .validate(process.env.SD_SAMPLER));
if (error !== undefined) {
  loggers.config.fatal('Fail to parse SD_SAMPLER', error);
  process.exit(1);
}
export const SAMPLER = value;

// SD_CTRL_MODEL_NAME
({ error, value } = joi
  .string()
  .label('SD_CTRL_MODEL_NAME')
  .required()
  .validate(process.env.SD_CTRL_MODEL_NAME));
if (error !== undefined) {
  loggers.config.fatal('Fail to parse SD_CTRL_MODEL_NAME', error);
  process.exit(1);
}
export const CTRL_MODEL_NAME = value;

// SD_CTRL_MODEL_URL
({ error, value } = joi
  .string()
  .label('SD_CTRL_MODEL_URL')
  .uri()
  .default(null)
  .validate(process.env.SD_CTRL_MODEL_URL));
if (error !== undefined) {
  loggers.config.fatal('Fail to parse SD_CTRL_MODEL_URL', error);
  process.exit(1);
}
export const CTRL_MODEL_URL = value;

// SD_BASIC_SIZE
({ error, value } = joi
  .number()
  .label('SD_BASIC_SIZE')
  .integer()
  .min(64)
  .max(2048)
  .default(768)
  .validate(process.env.SD_BASIC_SIZE));
if (error !== undefined) {
  loggers.config.fatal('Fail to parse SD_BASIC_SIZE', error);
  process.exit(1);
}
export const BASIC_SIZE = value;

// SD_ALLOW_HR
({ error, value } = joi
  .boolean()
  .label('SD_ALLOW_HR')
  .required()
  .validate(process.env.SD_ALLOW_HR));
if (error !== undefined) {
  loggers.config.fatal('Fail to parse SD_ALLOW_HR', error);
  process.exit(1);
}
export const ALLOW_HR = value;

// SD_HR_UPSCALER
({ error, value } = joi
  .string()
  .label('SD_HR_UPSCALER')
  .required()
  .validate(process.env.SD_HR_UPSCALER));
if (ALLOW_HR && error !== undefined) {
  loggers.config.fatal('Fail to parse SD_HR_UPSCALER', error);
  process.exit(1);
}
export const HR_UPSCALER = ALLOW_HR ? value : null;
