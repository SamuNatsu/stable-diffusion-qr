/// Configs module
import './init.js';

import * as svr from './svr.config.js';
import * as sd from './sd.config.js';
import * as sys from './sys.config.js';

import { loggers } from '@/utils/global.util.js';

// Config loaded
loggers.config.info('Config loaded', { svr, sd, sys });

// Export all
export { svr, sd, sys };
