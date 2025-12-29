const userHits = new Map();

export function rateLimiter(socket, limit = 20, interval = 10000) {
  const now = Date.now();
  const record = userHits.get(socket.id) || { count: 0, time: now };

  if (now - record.time > interval) {
    record.count = 0;
    record.time = now;
  }

  record.count++;
  userHits.set(socket.id, record);

  return record.count <= limit;
}
