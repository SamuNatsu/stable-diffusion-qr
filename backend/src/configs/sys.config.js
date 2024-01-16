/// System config module
import joi from 'joi';

import { loggers } from '@/utils/global.util.js';

// SYS_PROVIDER_NAME
let { error, value } = joi
  .string()
  .label('SYS_PROVIDER_NAME')
  .default('Stable Diffusion Share')
  .validate(process.env.SYS_PROVIDER_NAME);
if (error !== undefined) {
  loggers.config.fatal('Fail to parse SYS_PROVIDER_NAME', error);
  process.exit(1);
}
export const PROVIDER_NAME = value;

// SYS_PROVIDER_CONTACT
({ error, value } = joi
  .string()
  .label('SYS_PROVIDER_CONTACT')
  .default(null)
  .validate(process.env.SYS_PROVIDER_CONTACT));
if (error !== undefined) {
  loggers.config.fatal('Fail to parse SYS_PROVIDER_CONTACT', error);
  process.exit(1);
}
if (error !== undefined) {
  loggers.config.fatal('Fail to parse SYS_PROVIDER_CONTACT', error);
  process.exit(1);
}
export const PROVIDER_CONTACT = value;

// SYS_NOTIFICATION
({ error, value } = joi
  .string()
  .label('SYS_NOTIFICATION')
  .allow('')
  .default(null)
  .validate(process.env.SYS_NOTIFICATION));
if (error !== undefined) {
  loggers.config.fatal('Fail to parse SYS_NOTIFICATION', error);
  process.exit(1);
}
export const NOTIFICATION = value;

// SYS_MAX_QUEUE_LEN
({ error, value } = joi
  .number()
  .label('SYS_MAX_QUEUE_LEN')
  .integer()
  .min(5)
  .max(50)
  .default(20)
  .validate(process.env.SYS_MAX_QUEUE_LEN));
if (error !== undefined) {
  loggers.config.fatal('Fail to parse SYS_MAX_QUEUE_LEN', error);
  process.exit(1);
}
export const MAX_QUEUE_LEN = value;
