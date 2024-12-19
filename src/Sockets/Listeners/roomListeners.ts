import { Socket } from "socket.io-client";
import { RoomDetails } from "../../Interfaces";

type RoomUpdateCallback = (details: Partial<RoomDetails>) => void;

// Handles room event listeners
export const setupRoomListeners = (
    socket: Socket, 
    updateRoom: RoomUpdateCallback,
    updateUserDetails: (details: any) => void,
    nickname: string
) => {

    // Updating a team
    const handleTeamUpdate = (data: any) => {
        updateRoom({
            spectators: data.spectators,
            teamRed: data.teamRed,
            teamBlue: data.teamBlue,
        });
    };

    // Starting a game
    const handleGameStart = (gameData: any) => {
        updateRoom({
            gameStarted: true,
            gameGrid: gameData.gameGrid,
            currentTurn: gameData.currentTurn,
        });
    };

    // Spymaster submitting a clue
    const handleClueSubmission = (gameData: any) => {
        updateRoom({
            currentTurnData: gameData
        });
    };

    // Operator selecting a card
    const handleCardReveal = (gameData: any) => {
        updateRoom({
            gameGrid: gameData.gameGrid,
            teamRedPoints: gameData.teamRedPoints,
            teamBluePoints: gameData.teamBluePoints
        });
    };

    socket.on('team updated', handleTeamUpdate);
    socket.on('game started', handleGameStart);
    socket.on('clue submitted', handleClueSubmission);
    socket.on('card revealed', handleCardReveal);

    return () => {
        socket.off('team updated', handleTeamUpdate);
        socket.off('game started', handleGameStart);
        socket.off('clue submitted', handleClueSubmission);
        socket.off('card revealed', handleCardReveal);
    };
};