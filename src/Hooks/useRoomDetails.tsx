import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../Contexts/SocketContext';
import { RoomDetails, UserDetails } from '../Interfaces';

export const useRoomDetails = (roomCode: string, nickname: string) => {
    const { socket } = useSocket();
    const [roomDetails, setRoomDetails] = useState<RoomDetails>({
        gameLog: [],
        users: [],
        spectators: [],
        teamRed: [],
        teamBlue: [],
        gameGrid: [],
        gameStarted: false
    });
    const [joinError, setJoinError] = useState<string | null>(null);
    const [userDetails, setUserDetails] = useState<UserDetails>({
        teamColor: 'spectator',
        role: null
    });

    // Unified method for selecting a team role
    const selectTeamRole = useCallback((teamColor: 'red' | 'blue', roleType: 'operator' | 'spymaster') => {
        return new Promise<boolean>((resolve, reject) => {
            if (!socket) {
                reject(new Error('Socket not connected'));
                return;
            }

            socket.emit('select role', roomCode, nickname, teamColor, roleType, (response: any) => {
                if (response.success) {
                    setUserDetails({ teamColor, role: roleType });
                    setJoinError(null);
                    resolve(true);
                } else {
                    console.log('Failed joining team');
                    setJoinError(response.error || 'Failed to join team');
                    resolve(false);
                }
            });
        });
    }, [socket, roomCode, nickname]);

    useEffect(() => {
        if (!socket || !roomCode) return;

        // Initial room join
        const handleInitialJoin = (gameLog: any[], roomInfo: any) => {
            console.log("Room Info on Join: ", roomInfo);
            if (roomInfo.success) {
                // Updating user role and teamColor
                const userInTeamRed = roomInfo.teamRed.find((member: any) => member.nickname === nickname);
                const userInTeamBlue = roomInfo.teamBlue.find((member: any) => member.nickname === nickname);
                if (userInTeamRed) {
                    setUserDetails({ teamColor: 'red', role: userInTeamRed.role });
                } else if (userInTeamBlue) {
                    setUserDetails({ teamColor: 'blue', role: userInTeamBlue.role });
                } else {
                    setUserDetails({ teamColor: 'spectator', role: null });
                }

                console.log("Hitting");
                setRoomDetails({
                    gameLog: gameLog || [],
                    users: roomInfo.users || [],
                    spectators: roomInfo.spectators || [],
                    teamRed: roomInfo.teamRed || [],
                    teamBlue: roomInfo.teamBlue || [],
                    gameGrid: roomInfo.gameGrid || [],
                    gameStarted: roomInfo.gameStarted,
                    currentTurn: roomInfo.currentTurn,
                    currentTurnData: roomInfo.currentTurnData,
                    teamRedPoints: roomInfo.teamRedPoints,
                    teamBluePoints: roomInfo.teamBluePoints
                });
            }
        };

        // Team update handler
        const handleTeamUpdate = (data: any) => {
            setRoomDetails((prev) => ({
                ...prev,
                spectators: data.spectators,
                teamRed: data.teamRed,
                teamBlue: data.teamBlue,
            }));
        };

        // Game start handler
        const handleGameStart = (gameData: any) => {
            setRoomDetails((prev) => ({
                ...prev,
                gameStarted: true,
                gameGrid: gameData.gameGrid,
                currentTurn: gameData.currentTurn,
            }));
        };

        // Clue submission handler
        const handleClueSubmission = (gameData: any) => {
            console.log("Clue Submission: ", gameData);
            setRoomDetails((prev) => ({
                ...prev,
                currentTurnData: gameData
            }));
        };

        // Card reveal handler
        const handleCardReveal = (gameData: any) => {
            setRoomDetails((prev) => ({
                ...prev,
                gameGrid: gameData.gameGrid,
                teamRedPoints: gameData.teamRedPoints,
                teamBluePoints: gameData.teamBluePoints
            }))
        }

        // Emit join room event
        socket.emit('join room', roomCode, nickname, handleInitialJoin);

        // Setup event listeners
        socket.on('team updated', handleTeamUpdate);
        socket.on('game started', handleGameStart);
        socket.on('clue submitted', handleClueSubmission);
        socket.on('card revealed', handleCardReveal)

        // Cleanup listeners on unmount
        return () => {
            socket?.off('team updated', handleTeamUpdate);
            socket?.off('game started', handleGameStart);
            socket?.off('clue submitted', handleClueSubmission);
            socket?.off('card revealed', handleCardReveal);
        };
    }, [socket, roomCode, nickname]);

    return {
        roomDetails,
        selectTeamRole,
        joinError,
        userDetails  // now contains teamColor and role
    };
};
