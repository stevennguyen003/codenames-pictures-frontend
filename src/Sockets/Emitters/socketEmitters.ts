import { Socket } from "socket.io-client";

// Represents socket emitters that send messages back to server
export const socketEmitters = {

    authenticate: (socket: Socket, sessionId: string) => {
        socket.emit('authenticate', sessionId, (response: any) => {
            if (response.success) {
                console.log('Authenticated with existing session');
            } else {
                console.log('New session created');
            }
        });
    },

    sendMessage: (socket: Socket, message: any) => {
        socket.emit('message', message);
    },

    joinRoom: (socket: Socket, roomId: string) => {
        socket.emit('join_room', roomId);
    },

    leaveRoom: (socket: Socket, roomId: string) => {
        socket.emit('leave_room', roomId);
    },
};