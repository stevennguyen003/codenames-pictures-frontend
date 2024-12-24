import { Socket } from "socket.io-client";
import { GameState } from "../../Interfaces";

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

    const handleResetGame = (data: any) => {
        console.log("Game Reset: ", data);
        updateGameState({
            gameStarted: false,
            teamRedPoints: null,
            teamBluePoints: null,
            currentTurnData: null
        });
    }

    // Revealing a card
    const handleCardReveal = (data: any) => {
        console.log("Card revealed: ", data);
        updateGameState({
            teamRedPoints: data.teamRedPoints,
            teamBluePoints: data.teamBluePoints,
            currentTurnData: data.currentTurnData
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