import { useState, useEffect } from 'react';
import { useSocket } from '../Contexts/SocketContext';

interface RoomDetails {
    gameLog: any[];
    users: any[];
    spectators: TeamMember[];
    teamRed: TeamMember[];
    teamBlue: TeamMember[];
    gameStarted: boolean;
    gameGrid?: GameCard[];
    currentTurn?: 'red' | 'blue';
}

interface TeamMember {
    nickname: string;
    id: string;
    role: 'spectator' | 'operator' | 'spymaster';
}

interface GameCard {
    image: string;
    type: 'red' | 'blue' | 'neutral' | 'assassin';
    revealed: boolean;
}

export const useRoomDetails = (roomCode: string, nickname: string) => {
    const { socket } = useSocket();
    const [roomDetails, setRoomDetails] = useState<RoomDetails>({
        gameLog: [],
        users: [],
        spectators: [],
        teamRed: [],
        teamBlue: [],
        gameStarted: false,
    });

    useEffect(() => {
        if (!socket || !roomCode) return;
        socket.emit('join room', roomCode, nickname, (gameLog: any[], roomInfo: any) => {
            console.log("Room Info on Join: ", roomInfo);
            if (roomInfo.success) {
                setRoomDetails({
                    gameLog: gameLog || [],
                    users: roomInfo.users || [],
                    spectators: roomInfo.spectators || [],
                    teamRed: roomInfo.teamRed || [],
                    teamBlue: roomInfo.teamBlue || [],
                    gameStarted: false,
                });
            }
        });

        socket.on('team updated', (data: any) => {
            setRoomDetails((prev) => ({
                ...prev,
                spectators: data.spectators,
                teamRed: data.teamRed,
                teamBlue: data.teamBlue,
            }));
        });

        socket.on('game started', (gameData: any) => {
            setRoomDetails((prev) => ({
                ...prev,
                gameStarted: true,
                gameGrid: gameData.gameGrid,
                currentTurn: gameData.currentTurn,
            }));
        });

        return () => {
            socket?.off('team updated');
            socket?.off('game started');
        };
    }, [socket, roomCode, nickname]);

    return roomDetails;
};