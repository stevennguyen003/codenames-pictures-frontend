import { Socket } from 'socket.io-client';
import { socketEmitters } from '../Emitters/socketEmitters';

// Handles socket event listeners
export const setupSocketListeners = (socket: Socket, sessionId: string) => {

    // Connecting to server
    socket.on('connect', () => {
        socketEmitters.authenticate(socket, sessionId);
    });

    // Disconnection
    socket.on('disconnect', () => {
        console.log('Socket disconnected');
    });


    return () => {
        socket.off('connect');
        socket.off('disconnect');
    };
};