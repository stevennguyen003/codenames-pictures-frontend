import { useState, useEffect } from 'react';
import { useSocket } from '../Contexts/SocketContext';
import RoomPage from '../Pages/RoomPage';

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

export const useGameLogic = (roomCode: string, roomDetails: RoomDetails, socket: any) => {
    const [gameStarted, setGameStarted] = useState<boolean>(roomDetails.gameStarted);

    useEffect(() => {
        setGameStarted(roomDetails.gameStarted);
    }, [roomDetails.gameStarted]);

    // Check if the game can start based on team roles
    const canGameStart = () => {
        const redSpymasters = roomDetails.teamRed.filter(member => member.role === 'spymaster');
        const redOperators = roomDetails.teamRed.filter(member => member.role === 'operator');
        const blueSpymasters = roomDetails.teamBlue.filter(member => member.role === 'spymaster');
        const blueOperators = roomDetails.teamBlue.filter(member => member.role === 'operator');

        return redSpymasters.length >= 1 && redOperators.length >= 1 && blueSpymasters.length >= 1 && blueOperators.length >= 1;
    };

    // Function to start the game
    const startGame = () => {
        if (canGameStart() && socket) {
            socket.emit('start game', roomCode, (response: any) => {
                if (response.success) {
                    setGameStarted(true);
                    console.log("Game started successfully");
                } else {
                    console.error("Game start failed:", response.error);
                }
            });
        }
    };

    return {
        canGameStart,
        startGame,
        gameStarted,
    };
};
