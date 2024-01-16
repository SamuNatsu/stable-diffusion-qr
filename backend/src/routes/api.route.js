/// API route module
import apiInfoController from '@/controllers/api/info.controller.js';
import apiSSEController from '@/controllers/api/sse.controller.js';
import apiComposeController from '@/controllers/api/compose.controller.js';

import { Router } from 'express';

// Return router
export default Router()
  .get('/info', apiInfoController)
  .get('/sse', apiSSEController)
  .post('/compose', apiComposeController);
