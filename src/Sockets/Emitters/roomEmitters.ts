import { Socket } from "socket.io-client";

// Represents room emitters
export const roomEmitters = {

    // Join a room
    joinRoom: (
        socket: Socket, 
        roomCode: string, 
        nickname: string
    ): Promise<{ gameLog: any[], roomInfo: any }> => {
        return new Promise((resolve) => {
            socket.emit('join room', roomCode, nickname, 
                (gameLog: any[], roomInfo: any) => {
                    resolve({ gameLog, roomInfo });
                }
            );
        });
    },

    // Selecting a role
    selectRole: (
        socket: Socket,
        roomCode: string,
        nickname: string,
        teamColor: 'red' | 'blue',
        roleType: 'operator' | 'spymaster'
    ): Promise<{ success: boolean, error?: string }> => {
        return new Promise((resolve) => {
            socket.emit('select role', roomCode, nickname, teamColor, roleType, 
                (response: any) => {
                    resolve(response);
                }
            );
        });
    }
};