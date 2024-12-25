import { Socket } from "socket.io-client";
import { GameState } from "../../Interfaces";


// // Game state
// const [gameState, setGameState] = useState<GameState>({
//     gameStarted: false,
//     teamRedPoints: 0,
//     teamBluePoints: 0,
//     currentTurnData: null
//     gameOver: false
//     winner: null
// });

// Handles game listeners
export const setupGameListeners = (
    socket: Socket,
    updateGameState: (state: Partial<GameState>) => void
) => {

    // Starting a game
    const handleGameStart = (data: any) => {
        console.log("Game Started: ", data);
        updateGameState({
            gameStarted: true,
            currentTurnData: data.currentTurnData,
            teamRedPoints: data.teamRedPoints,
            teamBluePoints: data.teamBluePoints,
        });
    };

    // Resetting a game
    const handleResetGame = (data: any) => {
        console.log("Game Reset: ", data);
        updateGameState({
            gameStarted: false,
            currentTurnData: null,
            teamRedPoints: null,
            teamBluePoints: null,
        });
    }

    // Revealing a card
    const handleCardReveal = (data: any) => {
        console.log("Card revealed: ", data);
        updateGameState({
            gameStarted: data.gameStarted,
            teamRedPoints: data.teamRedPoints,
            teamBluePoints: data.teamBluePoints,
            currentTurnData: data.currentTurnData,
            gameOver: data.gameOver,
            winner: data.winner
        });
    };

    // Submitting a clue
    const handleClueSubmission = (data: any) => {
        console.log("Clue submitted: ", data);
        updateGameState({
            currentTurnData: data.currentTurnData
        });
    };

    socket.on('game started', handleGameStart);
    socket.on('reset game', handleResetGame);
    socket.on('card revealed', handleCardReveal);
    socket.on('clue submitted', handleClueSubmission);

    return () => {
        socket.off('game started', handleGameStart);
        socket.off('reset game', handleResetGame);
        socket.off('card revealed', handleCardReveal);
        socket.off('clue submitted', handleClueSubmission);
    };
};