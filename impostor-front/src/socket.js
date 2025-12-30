// src/socket.js
import io from 'socket.io-client';

// Conectamos al puerto 3001 (donde corre tu backend)
const socket = io('http://localhost:3001');

export default socket;