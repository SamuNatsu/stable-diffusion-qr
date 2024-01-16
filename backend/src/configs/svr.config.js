/// Server config module
import joi from 'joi';

import { loggers } from '@/utils/global.util.js';

// Port
let { error, value } = joi
  .number()
  .label('SVR_PORT')
  .port()
  .default(3000)
  .validate(process.env.SVR_PORT);
if (error !== undefined) {
  loggers.config.fatal('Fail to parse SVR_PORT', error);
  process.exit(1);
}
export const PORT = value;

// SVR_SSL
({ error, value } = joi
  .boolean()
  .label('SVR_SSL')
  .default(false)
  .validate(process.env.SVR_SSL));
if (error !== undefined) {
  loggers.config.fatal('Fail to parse SVR_SSL', error);
  process.exit(1);
}
export const SSL = value;

// SVR_SSL_CERT
({ error, value } = joi
  .string()
  .label('SVR_SSL_CERT')
  .uri()
  .required()
  .validate(process.env.SVR_SSL_CERT));
if (SSL && error !== undefined) {
  loggers.config.fatal('Fail to parse SVR_SSL_CERT', error);
  process.exit(1);
}
export const SSL_CERT = SSL ? value : null;

// SVR_SSL_KEY
({ error, value } = joi
  .string()
  .label('SVR_SSL_KEY')
  .uri()
  .required()
  .validate(process.env.SVR_SSL_CERT));
if (SSL && error !== undefined) {
  loggers.config.fatal('Fail to parse SVR_SSL_KEY', error);
  process.exit(1);
}
export const SSL_KEY = SSL ? value : null;
