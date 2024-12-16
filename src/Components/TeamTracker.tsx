import React from 'react';
import { TeamMember } from '../Interfaces';

// Props interface
interface TeamTrackerProps {
    teamColor: 'red' | 'blue';
    teamMembers: TeamMember[];
    onTeamMembersUpdate?: (members: TeamMember[]) => void;
    joinError?: string | null;
    onSelectRole: (teamColor: 'red' | 'blue', roleType: 'operator' | 'spymaster') => Promise<boolean>;
}

// Team Tracker component
const TeamTracker: React.FC<TeamTrackerProps> = ({ 
    teamColor, 
    teamMembers, 
    onTeamMembersUpdate,
    joinError,
    onSelectRole
}) => {

    // User joining a new role
    const handleJoinTeam = async (roleType: 'operator' | 'spymaster') => {
        const success = await onSelectRole(teamColor, roleType);
        if (success && onTeamMembersUpdate) {
            onTeamMembersUpdate(teamMembers);
        }
    };

    return (
        <div className={`p-4 border-2 ${teamColor === 'red' ? 'border-red-500' : 'border-blue-500'} rounded-lg`}>
            <h2 className={`text-xl font-bold mb-4 ${teamColor === 'red' ? 'text-red-600' : 'text-blue-600'}`}>
                {teamColor.charAt(0).toUpperCase() + teamColor.slice(1)} Team
            </h2>

            {/* Error Message */}
            {joinError && (
                <div className="text-red-500 mb-4">
                    {joinError}
                </div>
            )}

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
        </div>
    );
};

export default TeamTracker;