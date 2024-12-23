import { Socket } from 'socket.io-client';

// Represents game emitters
export const gameEmitters = {

    // Starting a game
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

    // Resetting a game
    resetGame: (
        socket: Socket,
        roomCode: string
    ): Promise<{ success: boolean, error?: string }> => {
        return new Promise((resolve) => {
            socket.emit('reset game', roomCode, (response: any) => {
                resolve(response);
            });
        });
    },

    // Card selection
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
    },

    // Clue submission
    submitClue: (
        socket: Socket,
        roomCode: string,
        clue: string,
        number: number
    ): Promise<{ success: boolean, error?: string }> => {
        return new Promise((resolve) => {
            socket.emit('submit clue', roomCode, clue, number, (response: any) => {
                resolve(response);
            });
        });
    }
};