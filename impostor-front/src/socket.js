// src/socket.js
import io from 'socket.io-client';

// Conectamos al puerto 3001 (donde corre tu backend)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const socket = io(BACKEND_URL);

export default socket;