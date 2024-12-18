import { useState, useEffect } from 'react';
import { RoomDetails } from '../Interfaces';

// Custom hook to handle game logic, specifically board management and score
export const useGameLogic = (roomCode: string, roomDetails: RoomDetails, socket: any) => {
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [clueSubmitted, setClueSubmitted] = useState<boolean>(false);
    const [teamRedPoints, setTeamRedPoints] = useState<number>(0);
    const [teamBluePoints, setTeamBluePoints] = useState<number>(0);

    useEffect(() => {
        setGameStarted(roomDetails.gameStarted);
    }, [roomDetails.gameStarted]);

    // Separate effect for clue submission
    useEffect(() => {
        if (roomDetails.currentTurnData) {
            setClueSubmitted(true);
        } else {
            setClueSubmitted(false);
        }
    }, [roomDetails.currentTurnData]);

    // // Separate effect for red team points
    // useEffect(() => {
    //     if (roomDetails.teamRedPoints) {
    //         setTeamRedPoints(roomDetails.teamRedPoints);
    //     }
    // }, [roomDetails.teamRedPoints]);

    // // Separate effect for blue team points
    // useEffect(() => {
    //     if (roomDetails.teamBluePoints) {
    //         setTeamBluePoints(roomDetails.teamBluePoints);
    //     }
    // }, [roomDetails.teamBluePoints]);

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

    // Function to handle card click
    const handleCardClick = (cardIndex: number) => {
        if (gameStarted && socket) {
            console.log("Card Clicked");
            socket.emit('card click', roomCode, cardIndex, (response: any) => {
                if (response.success) {
                    console.log("Card successfully selected");
                } else {
                    console.error("Card click failed:", response.error);
                }
            });
        }
    };

    return {
        canGameStart,
        startGame,
        gameStarted,
        handleCardClick,
        clueSubmitted,
        setClueSubmitted,
        // teamBluePoints,
        // teamRedPoints
    };
};
