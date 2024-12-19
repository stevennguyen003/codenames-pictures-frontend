import { Socket } from 'socket.io-client';

// Represents game emitters
export const gameEmitters = {
    
    startGame: (
        socket: Socket, 
        roomCode: string
    ): Promise<{ success: boolean, error?: string }> => {
        return new Promise((resolve) => {
            socket.emit('start game', roomCode, (response: any) => {
                resolve(response);
            });
        });
    },

    clickCard: (
        socket: Socket, 
        roomCode: string, 
        cardIndex: number
    ): Promise<{ success: boolean, error?: string }> => {
        return new Promise((resolve) => {
            socket.emit('card click', roomCode, cardIndex, (response: any) => {
                resolve(response);
            });
        });
    }
};