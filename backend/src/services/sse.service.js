/// SSE service module
import { customAlphabet } from 'nanoid';

import { loggers } from '@/utils/global.util';

// Create nanoid instance
const nanoid = customAlphabet(
  '346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnpqrtwxyz',
  32
);

// Session map
const sessions = {};

// Has session
export function hasSession(sid) {
  return sessions[sid] !== undefined;
}

// Generate SID
function generateSID() {
  while (true) {
    const sid = nanoid();
    if (!hasSession(sid)) {
      return sid;
    }
  }
}

// New seesion
function newSession(req, res) {
  const sid = generateSID();
  sessions[sid] = res;
  send(sid, 'session', sid);

  loggers.sse.info(`Session started: remote={${req.remote}}, sid=${sid}`);
  return sid;
}

// End session
function endSession(sid) {
  if (!hasSession(sid)) {
    loggers.sse.warn(`Cannot end an invalid SID: sid=${sid}`);
    return;
  }
  delete sessions[sid];
  loggers.sse.info(`Session ended: sid=${sid}`);
}

// Send
export function send(sid, event, data) {
  if (!hasSession(sid)) {
    loggers.sse.warn(
      `Cannot send to an invalid SID: sid=${sid}, event=${event}`
    );
    return;
  }
  data = JSON.stringify(data);
  sessions[sid].write(`event:${event}\ndata: ${data}\n\n`);
  loggers.sse.trace(`Data sent: sid=${sid}, size=${data.length}`);
}

// Broadcast
export function broadcast(event, data) {
  data = JSON.stringify(data);
  Object.values(sessions).forEach((s) => {
    s.write(`event:${event}\ndata: ${data}\n\n`);
  });
  loggers.sse.trace(`Data broadcast: size=${data.length}`);
}

// Handle connection
export function handleConnection(req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  loggers.sse.info(`Connection opened: remote={${req.remote}}`);

  const sid = newSession(req, res);
  res.on('close', () => {
    endSession(sid);
  });
}
