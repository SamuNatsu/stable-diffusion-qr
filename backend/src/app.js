/// Main entry
import express from 'express';
import fs from 'fs';
import https from 'https';
import http from 'http';

import addrMiddleware from '@/middlewares/addr.middleware.js';
import apiRoute from '@/routes/api.route.js';

import { loggers } from '@/utils/global.util.js';
import { svr } from '@/configs/index.js';

// Add listeners
process
  .addListener('uncaughtException', (err) => {
    loggers.main.fatal('Uncaught exception occurred', err);
    process.exit(1);
  })
  .addListener('unhandledRejection', (err) => {
    loggers.main.fatal('Unhandled rejection occurred', err);
    process.exit(1);
  });

// Create express server
const app = express();

// Mount middlewares
app
  .use(addrMiddleware)
  .use(express.static('./www'))
  .use(express.json());

// Mount routes
app.use('/api', apiRoute);

// Create HTTP(S) server
const server = svr.SSL
  ? https.createServer(
      {
        cert: fs.readFileSync(svr.SSL_CERT, 'utf-8'),
        key: fs.readFileSync(svr.SSL_KEY, 'utf-8')
      },
      app
    )
  : http.createServer(app);

// Start listening
server.listen(svr.PORT, () => {
  loggers.main.info(`Server started: port=${svr.PORT}, ssl=${svr.SSL}`);
});
