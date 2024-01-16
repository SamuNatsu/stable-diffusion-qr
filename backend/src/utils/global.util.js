/// Global dependencies module
import { Logger } from './Logger.util.js';

// Export module
export const loggers = {
  config: new Logger('Config'),
  main: new Logger('Main'),
  api: new Logger('API'),
  sse: new Logger('SSE'),
  compose: new Logger('Compose')
};
