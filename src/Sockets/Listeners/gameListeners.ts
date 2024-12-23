import { Socket } from "socket.io-client";
import { GameState } from "../../Interfaces";

// Handles game listeners
export const setupGameListeners = (
    socket: Socket,
    updateGameState: (state: Partial<GameState>) => void
) => {

    // Starting a game
    const handleGameStart = (gameData: any) => {
        updateGameState({
            gameStarted: true,
            teamRedPoints: gameData.teamRedPoints,
            teamBluePoints: gameData.teamBluePoints,
        });
    };

    const handleResetGame = (gameData: any) => {
        updateGameState({
            gameStarted: false,
            teamRedPoints: null,
            teamBluePoints: null,
            currentTurnData: null
        });
    }

    // Revealing a card
    const handleCardReveal = (gameData: any) => {
        updateGameState({
            teamRedPoints: gameData.teamRedPoints,
            teamBluePoints: gameData.teamBluePoints,
            currentTurnData: gameData.currentTurnData
        });
    };

    // Submitting a clue
    const handleClueUpdate = (turnData: any) => {
        updateGameState({
            currentTurnData: turnData
        });
    };

    socket.on('game started', handleGameStart);
    socket.on('reset game', handleResetGame);
    socket.on('card revealed', handleCardReveal);
    socket.on('clue submitted', handleClueUpdate);

    return () => {
        socket.off('game started', handleGameStart);
        socket.off('reset game', handleResetGame);
        socket.off('card revealed', handleCardReveal);
        socket.off('clue submitted', handleClueUpdate);
    };
};