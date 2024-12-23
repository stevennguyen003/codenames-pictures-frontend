import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';
import { RoomDetails, UserDetails, TeamMember, Team } from '../Interfaces';
import { setupRoomListeners } from '../Sockets/Listeners/roomListeners';
import { roomEmitters } from '../Sockets/Emitters/roomEmitters';

// Hook to handle room details
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
        currentTurn: null,
        currentTurnData: null,
        teamRedPoints: null,
        teamBluePoints: null
    });

    // Error handling
    const [joinError, setJoinError] = useState<string | null>(null);
    // User details for props
    const [userDetails, setUserDetails] = useState<UserDetails>({
        teamColor: 'spectator',
        role: null
    });

    // Updating the room details
    const updateRoomDetails = useCallback((details: Partial<RoomDetails>) => {
        setRoomDetails(prev => ({ ...prev, ...details }));
    }, []);

    // Selecting a new role
    const selectTeamRole = useCallback(async (
        teamColor: Team,
        roleType: 'operator' | 'spymaster'
    ) => {
        if (!socket) { throw new Error('Socket not connected'); }

        try {
            const response = await roomEmitters.selectRole(
                socket,
                roomCode,
                nickname,
                teamColor,
                roleType
            );
            if (response.success) {
                setUserDetails({ teamColor, role: roleType });
                setJoinError(null);
                return true;
            } else {
                setJoinError(response.error || 'Failed to join team');
                return false;
            }
        } catch (error) {
            setJoinError('Failed to join team');
            return false;
        }
    }, [socket, roomCode, nickname]);

    useEffect(() => {
        if (!socket || !roomCode) return;

        // Initializing the room on connection, will create new room if not found
        const initializeRoom = async () => {
            try {
                const { gameLog, roomInfo } = await roomEmitters.joinRoom(
                    socket,
                    roomCode,
                    nickname
                );

                if (roomInfo.success) {
                    const userInTeamRed = roomInfo.teamRed.find(
                        (member: TeamMember) => member.nickname === nickname
                    );
                    const userInTeamBlue = roomInfo.teamBlue.find(
                        (member: TeamMember) => member.nickname === nickname
                    );

                    if (userInTeamRed) {
                        setUserDetails({
                            teamColor: 'red',
                            role: userInTeamRed.role
                        });
                    } else if (userInTeamBlue) {
                        setUserDetails({
                            teamColor: 'blue',
                            role: userInTeamBlue.role
                        });
                    } else {
                        setUserDetails({
                            teamColor: 'spectator',
                            role: null
                        });
                    }

                    updateRoomDetails({
                        gameLog: gameLog || [],
                        users: roomInfo.users || [],
                        spectators: roomInfo.spectators || [],
                        teamRed: roomInfo.teamRed || [],
                        teamBlue: roomInfo.teamBlue || [],
                        gameGrid: roomInfo.gameGrid || [],
                        gameStarted: roomInfo.gameStarted,
                        currentTurnData: roomInfo.currentTurnData,
                        teamRedPoints: roomInfo.teamRedPoints,
                        teamBluePoints: roomInfo.teamBluePoints
                    });
                }
            } catch (error) {
                console.error('Failed to join room:', error);
                setJoinError('Failed to join room');
            }
        };

        // Cleaning up listeners
        const cleanup = setupRoomListeners(
            socket,
            updateRoomDetails,
            setUserDetails,
            nickname
        );

        initializeRoom();

        return () => {
            cleanup();
        };
    }, [socket, roomCode, nickname, updateRoomDetails]);

    return {
        roomDetails,
        selectTeamRole,
        joinError,
        userDetails
    };
};