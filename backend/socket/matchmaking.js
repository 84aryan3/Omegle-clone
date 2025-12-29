import { redis } from "../redis/redis.js"
import { createRoom } from "./rooms.js"

const QUEUE_KEY = "matchmaking_queue"

function getCommonInterests(a = [], b = []) {
  if (!Array.isArray(a) || !Array.isArray(b)) {
    return []
  }
  
  // Normalize interests: lowercase, trim, remove empty strings
  const normalize = (arr) => 
    arr.map(i => i.trim().toLowerCase()).filter(i => i.length > 0)
  
  const normalizedA = normalize(a)
  const normalizedB = normalize(b)
  
  return normalizedA.filter(i => normalizedB.includes(i))
}

export async function addToQueue(socket, io, interests = []) {
  await removeFromQueue(socket.id)

  // Clean dead sockets from queue
  const rawQueue = await redis.lrange(QUEUE_KEY, 0, -1)
  const queue = []

  for (const raw of rawQueue) {
    try {
      const item = JSON.parse(raw)
      if (io.sockets.sockets.has(item.socketId)) {
        queue.push(item)
      } else {
        await redis.lrem(QUEUE_KEY, 1, raw)
      }
    } catch (e) {
      await redis.lrem(QUEUE_KEY, 1, raw)
    }
  }

  // Normalize incoming interests
  const normalizedInterests = Array.isArray(interests) 
    ? interests.map(i => i.trim().toLowerCase()).filter(i => i.length > 0)
    : []

  // Try to find best match (shared interests first)
  let match = null
  let matchRaw = null
  let commonInterests = []

  for (const item of queue) {
    if (item.socketId === socket.id) continue

    const itemInterests = Array.isArray(item.interests) 
      ? item.interests.map(i => i.trim().toLowerCase()).filter(i => i.length > 0)
      : []

    const common = getCommonInterests(normalizedInterests, itemInterests)
    if (common.length > 0) {
      match = item
      matchRaw = JSON.stringify(item)
      commonInterests = common
      break
    }
  }

  // If no shared-interest match, pick ANYONE
  if (!match && queue.length > 0) {
    const candidate = queue.find(q => q.socketId !== socket.id)
    if (candidate) {
      match = candidate
      matchRaw = JSON.stringify(candidate)
      const candidateInterests = Array.isArray(candidate.interests) 
        ? candidate.interests.map(i => i.trim().toLowerCase()).filter(i => i.length > 0)
        : []
      commonInterests = getCommonInterests(normalizedInterests, candidateInterests)
    }
  }

  // If match found → connect
  if (match) {
    await redis.lrem(QUEUE_KEY, 1, matchRaw)

    const roomId = createRoom(socket.id, match.socketId)

    socket.join(roomId)
    const partner = io.sockets.sockets.get(match.socketId)
    partner?.join(roomId)

    // Properly format common interests for display
    const formattedCommonInterests = commonInterests.map(i => 
      i.charAt(0).toUpperCase() + i.slice(1)
    )

    socket.emit("matched", {
      roomId,
      commonInterests: formattedCommonInterests,
    })

    partner?.emit("matched", {
      roomId,
      commonInterests: formattedCommonInterests,
    })

    return
  }

  // Otherwise, push yourself to queue
  await redis.rpush(
    QUEUE_KEY,
    JSON.stringify({
      socketId: socket.id,
      interests: normalizedInterests,
    })
  )
}

export async function removeFromQueue(socketId) {
  const queue = await redis.lrange(QUEUE_KEY, 0, -1)
  for (const raw of queue) {
    try {
      const item = JSON.parse(raw)
      if (item.socketId === socketId) {
        await redis.lrem(QUEUE_KEY, 1, raw)
        break
      }
    } catch (e) {
      continue
    }
  }
}