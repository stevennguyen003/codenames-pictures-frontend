import { Socket } from "socket.io-client";
import { RoomDetails } from "../../Interfaces";

type RoomUpdateCallback = (details: Partial<RoomDetails>) => void;

// const [roomDetails, setRoomDetails] = useState<RoomDetails>({
//     gameLog: [],
//     users: [],
//     spectators: [],
//     teamRed: [],
//     teamBlue: [],
//     gameGrid: [],
//     gameStarted: false,
//     currentTurnData: null,
//     teamRedPoints: null,
//     teamBluePoints: null
// });

// Handles room event listeners
export const setupRoomListeners = (
    socket: Socket,
    updateRoom: RoomUpdateCallback,
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
            currentTurnData: data.currentTurnData,
            teamRedPoints: data.teamRedPoints,
            teamBluePoints: data.teamBluePoints
        });
    };

    // Operator selecting a card
    const handleCardReveal = (data: any) => {
        updateRoom({
            gameGrid: data.gameGrid,
            currentTurnData: data.currentTurnData,
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