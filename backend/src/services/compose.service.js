/// Compose service module
import async from 'async';
import jb from 'json-bigint';
import moment from 'moment';
import QRCode from 'qrcode';

import { broadcast, hasSession, send } from './sse.service.js';
import { loggers } from '@/utils/global.util.js';
import { sd, sys } from '@/configs/index.js';

// JSON big
const JSONbig = jb({ useNativeBigInt: true });

// Accumulated serial
let serial = 0;

// Current serial
let curSerial = -1;

// Task queue
const queue = async.queue(async (task) => {
  // Get start time
  const time = moment().format('YYYY-MM-DD HH:mm:ss Z');

  // Notify other sessions
  curSerial = task.serial;
  broadcast('queue', curSerial);

  // Check session available
  if (!hasSession(task.sid)) {
    loggers.compose.warn(
      `Session not found: serial=${task.serial} sid=${task.sid}`
    );
    return;
  }

  // Convert seed string to bigint
  task.args.seed = BigInt(task.args.seed);

  // Set control net args
  task.args.alwayson_scripts = {
    controlnet: {
      args: [
        {
          input_image: (
            await QRCode.toDataURL(task.args.data, {
              color: {
                dark: task.args.front_col,
                light: task.args.back_col
              },
              errorCorrectionLevel: task.args.err_lv,
              margin: task.args.margin,
              width: sd.BASIC_SIZE
            })
          ).slice(22),
          model: sd.CTRL_MODEL_NAME,
          weight: task.args.weight,
          control_mode: task.args.mode,
          pixel_perfect: true
        }
      ]
    }
  };
  delete task.args.data;
  delete task.args.front_col;
  delete task.args.back_col;
  delete task.args.err_lv;
  delete task.args.margin;
  delete task.args.weight;
  delete task.args.mode;

  // Construct payload
  const payload = {
    ...task.args,
    width: sd.BASIC_SIZE,
    height: sd.BASIC_SIZE,
    sampler_name: sd.SAMPLER
  };
  loggers.compose.info(
    `Composing image: serial=${task.serial}, time={${time}}`,
    payload
  );

  // Await fetching
  await fetch(sd.API, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSONbig.stringify(payload)
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }

      // Fail to generate
      loggers.compose.warn(`Fail to generate: serial=${task.serial}`, res);
      send(task.sid, 'fail', 'generate');
    })
    .then((data) => {
      if (data === undefined) {
        return;
      }

      // Generated
      loggers.compose.info(`Generated: serial=${task.serial}`);
      send(task.sid, 'done', data);
    })
    .catch((err) => {
      // Fail to query
      loggers.compose.warn(`Fail to query API: serial=${task.serial}`, err);
      send(task.sid, 'fail', 'api');
    });
});
queue.error((err, task) => {
  loggers.compose.warn(`Unexpected compose error: serial=${task.serial}`, err);
  send(task.sid, 'fail', 'api');
});

// New task
export function newTask(res, task) {
  // Check session ID
  const sid = task.sid;
  delete task.sid;
  if (!hasSession(sid)) {
    loggers.compose.warn(`Session not found: sid=${sid}`);
    return res.sendStatus(401);
  }

  // Check queue capacity
  if (queue.length() >= sys.MAX_QUEUE_LEN) {
    send(sid, 'fail', 'queue');
    loggers.compose.warn(`Queue is full: sid=${sid}`);
    return res.sendStatus(204);
  }

  // Push new task
  send(sid, 'serial', serial);
  if (serial !== curSerial + 1) {
    send(sid, 'queue', curSerial);
  }
  queue.push({ sid, serial, args: task });
  loggers.compose.info(`New compose task: sid=${sid}, serial=${serial}`);
  serial++;
  return res.sendStatus(204);
}
