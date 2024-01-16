/// Address middleware module

// Export middleware
export default function (req, _, next) {
  req.remote = `${req.socket.remoteAddress}:${req.socket.remotePort}`;
  next();
}
