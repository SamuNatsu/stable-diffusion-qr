/// Config initialize module
import dotenv from 'dotenv';

import { loggers } from '@/utils/global.util.js';

// Parse environment file
const { error } = dotenv.config();
if (error !== undefined) {
  loggers.config.fatal('Fail to parse config file', error);
  process.exit(1);
}
