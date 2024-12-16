import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../Contexts/SocketContext';
import { RoomDetails } from '../Interfaces';

export const useRoomDetails = (roomCode: string, nickname: string) => {
    const { socket } = useSocket();
    const [roomDetails, setRoomDetails] = useState<RoomDetails>({
        gameLog: [],
        users: [],
        spectators: [],
        teamRed: [],
        teamBlue: [],
        gameGrid: [],
        gameStarted: false,
    });
    const [joinError, setJoinError] = useState<string | null>(null);

    // Unified method for selecting a team role
    const selectTeamRole = useCallback((teamColor: 'red' | 'blue', roleType: 'operator' | 'spymaster') => {
        return new Promise<boolean>((resolve, reject) => {
            if (!socket) {
                reject(new Error('Socket not connected'));
                return;
            }

            socket.emit('select role', roomCode, nickname, teamColor, roleType, (response: any) => {
                if (response.success) {
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
                setRoomDetails({
                    gameLog: gameLog || [],
                    users: roomInfo.users || [],
                    spectators: roomInfo.spectators || [],
                    teamRed: roomInfo.teamRed || [],
                    teamBlue: roomInfo.teamBlue || [],
                    gameGrid: roomInfo.gameGrid || [],
                    gameStarted: roomInfo.gameStarted,
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

        // Emit join room event
        socket.emit('join room', roomCode, nickname, handleInitialJoin);

        // Setup event listeners
        socket.on('team updated', handleTeamUpdate);
        socket.on('game started', handleGameStart);

        // Cleanup listeners on unmount
        return () => {
            socket?.off('team updated', handleTeamUpdate);
            socket?.off('game started', handleGameStart);
        };
    }, [socket, roomCode, nickname]);

    return {
        roomDetails,
        selectTeamRole,
        joinError
    };
};