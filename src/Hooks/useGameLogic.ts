import { useState, useEffect, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { RoomDetails, GameState } from '../Interfaces';
import { gameEmitters } from '../Sockets/Emitters/gameEmitters';
import { setupGameListeners } from '../Sockets/Listeners/gameListeners';

// Hook for game logic
export const useGameLogic = (
    roomCode: string,
    roomDetails: RoomDetails,
    socket: Socket | null
) => {
    // Game state
    const [gameState, setGameState] = useState<GameState>({
        gameStarted: false,
        teamRedPoints: 0,
        teamBluePoints: 0,
        currentTurnData: null
    });

    // Updating a game state
    const updateGameState = useCallback((newState: Partial<GameState>) => {
        setGameState(prev => ({ ...prev, ...newState }));
    }, []);

    // Operator and spymaster requirements to start a game
    const canGameStart = useCallback(() => {
        const redSpymasters = roomDetails.teamRed.filter(member => member.role === 'spymaster');
        const redOperators = roomDetails.teamRed.filter(member => member.role === 'operator');
        const blueSpymasters = roomDetails.teamBlue.filter(member => member.role === 'spymaster');
        const blueOperators = roomDetails.teamBlue.filter(member => member.role === 'operator');

        return (
            redSpymasters.length >= 1 &&
            redOperators.length >= 1 &&
            blueSpymasters.length >= 1 &&
            blueOperators.length >= 1
        );
    }, [roomDetails.teamRed, roomDetails.teamBlue]);

    useEffect(() => {
        updateGameState({
            gameStarted: roomDetails.gameStarted,
            currentTurnData: roomDetails.currentTurnData
        });
    }, [roomDetails.gameStarted, roomDetails.currentTurnData, updateGameState]);

    useEffect(() => {
        if (!socket) return;
        return setupGameListeners(socket, updateGameState);
    }, [socket, updateGameState]);

    // Starting a game
    const startGame = useCallback(async () => {
        if (!socket || !canGameStart()) return;

        try {
            const response = await gameEmitters.startGame(socket, roomCode);
            if (!response.success) {
                console.error("Game start failed:", response.error);
            }
        } catch (error) {
            console.error("Error starting game:", error);
        }
    }, [socket, canGameStart, roomCode]);

    // Resetting a game
    const resetGame = useCallback(async () => {
        if (!socket) return;

        try {
            const response = await gameEmitters.resetGame(socket, roomCode);
            if (!response.success) {
                console.error("Game reset failed:", response.error);
            }
        } catch (error) {
            console.error("Error resetting game:", error);
        }
    }, [socket, roomCode]);

    // Handling card selection
    const handleCardClick = useCallback(async (cardIndex: number) => {
        if (!socket || !gameState.gameStarted) return;

        try {
            const response = await gameEmitters.clickCard(socket, roomCode, cardIndex);
            if (!response.success) {
                console.error("Card click failed:", response.error);
            }
        } catch (error) {
            console.error("Error handling card click:", error);
        }
    }, [socket, gameState.gameStarted, roomCode]);

    return {
        canGameStart,
        startGame,
        gameStarted: gameState.gameStarted,
        handleCardClick,
        resetGame,
        teamRedPoints: gameState.teamRedPoints,
        teamBluePoints: gameState.teamBluePoints,
        currentTurnData: gameState.currentTurnData
    };
};