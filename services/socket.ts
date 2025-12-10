import { io, Socket } from 'socket.io-client';
import { API_ORIGIN } from './api';

let chatSocket: Socket | null = null;
let currentUserId: number | null = null;

export function getChatSocket(userId: number) {
  if (chatSocket && currentUserId === userId) {
    return chatSocket;
  }

  if (chatSocket) {
    try { chatSocket.disconnect(); } catch {}
    chatSocket = null;
  }

  currentUserId = userId;
  chatSocket = io(`${API_ORIGIN}/chat`, {
    transports: ['websocket'],
    forceNew: true,
    query: { userId: String(userId) },
  });

  return chatSocket;
}

export function disconnectChatSocket() {
  if (chatSocket) {
    chatSocket.disconnect();
    chatSocket = null;
    currentUserId = null;
  }
}
