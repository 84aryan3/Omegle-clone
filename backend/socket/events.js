// backend/socket/events.js
import { removeFromQueue } from "./matchmaking.js";
import { getRoom, deleteRoom, getAllRooms } from "./rooms.js";

export function registerEvents(io, socket) {
  console.log(`New socket connection: ${socket.id}`);

  // Join a room (room created by backend matchmaking)
  socket.on("join_room", ({ roomId }) => {
    console.log(`Socket ${socket.id} joining room ${roomId}`);
    socket.join(roomId);
  });

  // WebRTC signaling: forward offer to other peer(s) in the room
  socket.on("webrtc_offer", ({ roomId, offer }) => {
    console.log(`WebRTC offer from ${socket.id} to room ${roomId}`);
    // send to everyone in room except the sender
    socket.to(roomId).emit("webrtc_offer", { roomId, offer });
  });

  // WebRTC signaling: forward answer to other peer(s)
  socket.on("webrtc_answer", ({ roomId, answer }) => {
    console.log(`WebRTC answer from ${socket.id} to room ${roomId}`);
    socket.to(roomId).emit("webrtc_answer", { roomId, answer });
  });

  // WebRTC signaling: forward ICE candidates
  socket.on("webrtc_ice", ({ roomId, candidate }) => {
    // candidate can be null/undefined in some browsers; guard logging
    console.log(`ICE candidate from ${socket.id} to room ${roomId}`, !!candidate);
    socket.to(roomId).emit("webrtc_ice", { roomId, candidate });
  });

  // Chat messages: forward plaintext messages to other peer(s)
  socket.on("message", ({ roomId, message }) => {
    console.log(`Message from ${socket.id} in room ${roomId}:`, message && message.slice ? message.slice(0, 80) : typeof message);
    // emit raw message string to other clients in the room
    socket.to(roomId).emit("message", message);
  });

  // Client asks to leave the room (user pressed leave / skip)
  socket.on("leave", ({ roomId }) => {
    console.log(`Socket ${socket.id} leaving room ${roomId}`);
    handleLeave(roomId, socket, io);
  });

  // Cleanup on disconnect: notify remaining peer(s) and delete room
  socket.on("disconnect", (reason) => {
    console.log(`Socket disconnected: ${socket.id} (${reason})`);
    // Remove from matchmaking queue (if present)
    removeFromQueue(socket.id).catch(err => {
      if (err) console.error('Error removing from queue:', err);
    });

    // Find any rooms containing this socket and handle leaving
    try {
      for (const [roomId, users] of getAllRooms()) {
        if (users && users.includes(socket.id)) {
          console.log(`Handling disconnect for socket ${socket.id} in room ${roomId}`);
          handleLeave(roomId, socket, io);
        }
      }
    } catch (err) {
      console.error('Error while handling disconnect rooms:', err);
    }
  });

  // Internal helper to notify the other peer and clean up room
  function handleLeave(roomId, departingSocket, ioInstance) {
    try {
      const users = getRoom(roomId);
      if (!users) {
        // nothing to do
        return;
      }

      // Notify remaining user(s)
      const remainingUsers = users.filter(id => id !== departingSocket.id);
      if (remainingUsers && remainingUsers.length > 0) {
        remainingUsers.forEach(remainingId => {
          console.log(`Notifying remaining user ${remainingId} in room ${roomId}`);
          ioInstance.to(remainingId).emit("stranger_left", { roomId });
        });
      }

      // Delete the room and make departing socket leave
      deleteRoom(roomId);
      try {
        departingSocket.leave(roomId);
      } catch (e) {
        // ignore if socket already left/disconnected
      }

      console.log(`Room ${roomId} cleaned up`);
    } catch (err) {
      console.error("Error in handleLeave:", err);
    }
  }
}
