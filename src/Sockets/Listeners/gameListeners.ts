import { Socket } from "socket.io-client";

export interface GameState {
    gameStarted: boolean;
    teamRedPoints: number;
    teamBluePoints: number;
    currentTurnData: any;
}

// Handles game listeners
export const setupGameListeners = (
    socket: Socket,
    updateGameState: (state: Partial<GameState>) => void
) => {

    // Starting a game
    const handleGameStart = (gameData: any) => {
        updateGameState({
            gameStarted: true,
        });
    };

    // Revealing a card
    const handleCardReveal = (gameData: any) => {
        updateGameState({
            teamRedPoints: gameData.teamRedPoints,
            teamBluePoints: gameData.teamBluePoints
        });
    };

    // Submitting a clue
    const handleClueUpdate = (turnData: any) => {
        updateGameState({
            currentTurnData: turnData
        });
    };

    socket.on('game started', handleGameStart);
    socket.on('card revealed', handleCardReveal);
    socket.on('clue submitted', handleClueUpdate);

    return () => {
        socket.off('game started', handleGameStart);
        socket.off('card revealed', handleCardReveal);
        socket.off('clue submitted', handleClueUpdate);
    };
};