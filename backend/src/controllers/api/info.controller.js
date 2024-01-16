/// API info controller module
import { loggers } from '@/utils/global.util.js';
import { getInfo } from '@/services/info.service.js';

// Export module
export default function (req, res) {
  loggers.api.info(`Query info: remote={${req.remote}}`);
  return res.send(getInfo());
}
