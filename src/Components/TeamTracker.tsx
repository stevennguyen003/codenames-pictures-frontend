import React, { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';

interface TeamMember {
    nickname: string;
    id: string;
    role: 'spectator' | 'operator' | 'spymaster';
}

interface TeamTrackerProps {
    socket: Socket;
    roomCode: string;
    nickname: string;
    teamColor: 'red' | 'blue';
    teamMembersRef?: React.MutableRefObject<TeamMember[]>;
    onTeamMembersUpdate?: (members: TeamMember[]) => void;
}

const TeamTracker: React.FC<TeamTrackerProps> = ({ 
    socket, 
    roomCode, 
    nickname, 
    teamColor, 
    teamMembersRef,
    onTeamMembersUpdate 
}) => {
    // Local state for team members if no ref is provided
    const [localTeamMembers, setLocalTeamMembers] = useState<TeamMember[]>([]);
    const [joinError, setJoinError] = useState<string | null>(null);

    // Determine which team members to use
    const teamMembers = teamMembersRef ? teamMembersRef.current : localTeamMembers;

    useEffect(() => {
        // Listen for team updates
        const handleTeamUpdate = (data: any) => {
            const teamToUpdate = teamColor === 'red' ? data.teamRed : data.teamBlue;
            
            // Update either the ref or local state
            if (teamMembersRef && onTeamMembersUpdate) {
                teamMembersRef.current = teamToUpdate;
                onTeamMembersUpdate(teamToUpdate);
            } else {
                setLocalTeamMembers(teamToUpdate);
            }
        };

        socket.on('team updated', handleTeamUpdate);

        // Cleanup listener on unmount
        return () => {
            socket.off('team updated', handleTeamUpdate);
        };
    }, [socket, teamColor, teamMembersRef, onTeamMembersUpdate]);

    const handleJoinTeam = (roleType: 'operator' | 'spymaster') => {
        socket.emit('select role', roomCode, nickname, teamColor, roleType, (response: any) => {
            if (response.success) {
                console.log('joined team');
                setJoinError(null);
            } else {
                console.log('failed joining team');
                setJoinError(response.error);
            }
        });
    };

    return (
        <div className={`p-4 border-2 ${teamColor === 'red' ? 'border-red-500' : 'border-blue-500'} rounded-lg`}>
            <h2 className={`text-xl font-bold mb-4 ${teamColor === 'red' ? 'text-red-600' : 'text-blue-600'}`}>
                {teamColor.charAt(0).toUpperCase() + teamColor.slice(1)} Team
            </h2>

            {/* Buttons to Join Teams */}
            <div className="flex space-x-2 mb-4">
                <button
                    onClick={() => handleJoinTeam('operator')}
                    className={`px-4 py-2 rounded ${teamColor === 'red'
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-blue-500 hover:bg-blue-600'
                        } text-white`}
                >
                    Join as Operative
                </button>
                <button
                    onClick={() => handleJoinTeam('spymaster')}
                    className={`px-4 py-2 rounded ${teamColor === 'red'
                        ? 'bg-red-700 hover:bg-red-800'
                        : 'bg-blue-700 hover:bg-blue-800'
                        } text-white`}
                >
                    Join as Spymaster
                </button>
            </div>

            {/* Team Members List */}
            <div>
                <h3 className="font-semibold mb-2">Team Members:</h3>
                {teamMembers.length === 0 ? (
                    <p className="text-gray-500">No team members yet</p>
                ) : (
                    <ul>
                        {teamMembers.map((member) => (
                            <li
                                key={member.id}
                                className={`${member.role === 'spymaster'
                                    ? 'font-bold'
                                    : 'font-normal'
                                    }`}
                            >
                                {member.nickname}
                                {member.role === 'spymaster' && ' (Spymaster)'}
                                {member.role === 'operator' && ' (Operative)'}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {joinError && (
                <div className="text-red-500 mt-2">
                    {joinError}
                </div>
            )}
        </div>
    );
};

export default TeamTracker;