import { TeamMember } from '../Interfaces';

// Props interface
interface TeamTrackerProps {
    nickname: string;
    teamColor: 'red' | 'blue';
    teamMembers: TeamMember[];
    onTeamMembersUpdate?: (members: TeamMember[]) => void;
    joinError?: string | null;
    onSelectRole: (teamColor: 'red' | 'blue', roleType: 'operator' | 'spymaster') => Promise<boolean>;
    gameStarted: boolean;
}

// Team Tracker component as a function declaration
function TeamTracker({ 
    nickname,
    teamColor, 
    teamMembers, 
    onTeamMembersUpdate,
    joinError,
    onSelectRole,
    gameStarted
}: TeamTrackerProps) {
    // User joining a new role
    const handleJoinTeam = async (roleType: 'operator' | 'spymaster') => {
        const success = await onSelectRole(teamColor, roleType);
        if (success && onTeamMembersUpdate) {
            onTeamMembersUpdate(teamMembers);
        }
    };

    // Function to render team member bubbles
    const renderTeamMembers = (members: TeamMember[]) => {
        return members.map((member) => (
            <li
                key={member.id}
                className={`inline-block mb-1 mr-2 px-4 py-1 rounded-md ${
                    member.nickname === nickname
                        ? teamColor === 'red'
                            ? 'bg-red-500 text-white' // Current user's bubble in red
                            : 'bg-blue-500 text-white' // Current user's bubble in blue
                        : teamColor === 'red'
                        ? 'bg-red-300 text-white' // Non-current red team members
                        : 'bg-blue-300 text-white' // Non-current blue team members
                }`}
            >
                {member.nickname}
            </li>
        ));
    };

    // Separate operators and spymasters
    const operators = teamMembers.filter(member => member.role === 'operator');
    const spymasters = teamMembers.filter(member => member.role === 'spymaster');

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
            {!gameStarted && (
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
            )}

            {/* Team Members List */}
            <div>
                {/* Spymasters Section */}
                <h3 className="font-semibold mb-2">Spymaster:</h3>
                {spymasters.length === 0 ? (
                    <p className="text-gray-500 mb-4">No spymaster assigned</p>
                ) : (
                    <ul className="mb-4">
                        {renderTeamMembers(spymasters)}
                    </ul>
                )}

                {/* Operators Section */}
                <h3 className="font-semibold mb-2">Operatives:</h3>
                {operators.length === 0 ? (
                    <p className="text-gray-500">No operatives assigned</p>
                ) : (
                    <ul>
                        {renderTeamMembers(operators)}
                    </ul>
                )}
            </div>
        </div>
    );
}
export default TeamTracker;