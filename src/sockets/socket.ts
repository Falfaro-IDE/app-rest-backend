import { io } from "socket.io-client";
const API_BASE_URL = import.meta.env.VITE_API_SOCKET || "http://localhost:5000";

console.log("Connecting to socket at:", API_BASE_URL);
const socket = io(API_BASE_URL);

export default socket;