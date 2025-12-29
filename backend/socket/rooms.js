import { v4 as uuid } from "uuid";

const rooms = new Map();

export function createRoom(user1, user2) {
  const roomId = uuid();
  rooms.set(roomId, [user1, user2]);
  return roomId;
}

export function getRoom(roomId) {
  return rooms.get(roomId);
}

export function deleteRoom(roomId) {
  rooms.delete(roomId);
}

export function getAllRooms() {
  return rooms.entries();
}
