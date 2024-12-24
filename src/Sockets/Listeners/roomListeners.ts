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
    const handleGameStart = (data: any) => {
        updateRoom({
            gameStarted: true,
            gameGrid: data.gameGrid,
        });
    };

    // Operator selecting a card
    const handleCardReveal = (data: any) => {
        updateRoom({
            gameGrid: data.gameGrid,
            teamRedPoints: data.teamRedPoints,
            teamBluePoints: data.teamBluePoints
        });
    };

    socket.on('team updated', handleTeamUpdate);
    socket.on('game started', handleGameStart);
    socket.on('card revealed', handleCardReveal);

    return () => {
        socket.off('team updated', handleTeamUpdate);
        socket.off('game started', handleGameStart);
        socket.off('card revealed', handleCardReveal);
    };
};