import { io } from "socket.io-client"

// Use environment variable or default
const SOCKET_URL = import.meta.env.PUBLIC_SOCKET_URL || "http://localhost:5000"

console.log("Connecting to socket server at:", SOCKET_URL)

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  forceNew: true
})

// Connection status listeners
socket.on("connect", () => {
  console.log("Socket connected with ID:", socket.id)
})

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason)
  if (reason === "io server disconnect") {
    // Server forced disconnect, try to reconnect
    socket.connect()
  }
})

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error.message)
  console.log("Attempting to reconnect...")
})

socket.on("reconnect", (attemptNumber) => {
  console.log(`Socket reconnected after ${attemptNumber} attempts`)
})

socket.on("reconnect_error", (error) => {
  console.error("Socket reconnection error:", error)
})

socket.on("reconnect_failed", () => {
  console.error("Socket reconnection failed")
  alert("Connection to server lost. Please refresh the page.")
})

// Helper function to ensure socket is connected
export const ensureSocketConnected = () => {
  if (!socket.connected) {
    console.log("Socket not connected, connecting...")
    socket.connect()
  }
  return socket
}