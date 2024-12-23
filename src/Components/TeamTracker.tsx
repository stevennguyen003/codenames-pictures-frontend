import { TeamMember, TurnData } from '../Interfaces';

interface TeamTrackerProps {
    nickname: string;
    teamColor: 'red' | 'blue';
    teamMembers: TeamMember[];
    onTeamMembersUpdate?: (members: TeamMember[]) => void;
    onSelectRole: (teamColor: 'red' | 'blue', roleType: 'operator' | 'spymaster') => Promise<boolean>;
    currentTurnData: TurnData | null;
    teamPoints: number | null;
}

function TeamTracker({
    nickname,
    teamColor,
    teamMembers,
    onTeamMembersUpdate,
    onSelectRole,
    currentTurnData,
    teamPoints
}: TeamTrackerProps) {
    const handleJoinTeam = async (roleType: 'operator' | 'spymaster') => {
        const success = await onSelectRole(teamColor, roleType);
        if (success && onTeamMembersUpdate) {
            onTeamMembersUpdate(teamMembers);
        }
    };

    const renderTeamMembers = (members: TeamMember[]) => {
        return members.map((member) => (
            <li
                key={member.id}
                className={`inline-block mb-1 mr-2 px-2 py-0 rounded-md border-2 border-white text-white
                    ${member.nickname === nickname ? 'font-bold' : 'font-normal'}`}
            >
                {member.nickname}
            </li>
        ));
    };

    const operators = teamMembers.filter(member => member.role === 'operator');
    const spymasters = teamMembers.filter(member => member.role === 'spymaster');

    // Custom colors
    const backgroundColor = teamColor === 'red' ? '#B22222' : '#4169E1';
    const buttonColor = '#C7B299';
    const titleColor = teamColor === 'red' ? '#FF7F7F' : '#ADD8E6'; 

    return (
        <div 
            className="p-4 shadow-lg rounded-lg"
            style={{ backgroundColor }}
        >
            <h2 className="text-xl font-bold mb-4 text-white flex items-center">
                {teamColor.charAt(0).toUpperCase() + teamColor.slice(1)} Team
                {teamPoints !== null && (
                    <span className="ml-2 text-lg font-semibold bg-white/20 px-2 py-1 rounded">
                        {teamPoints}
                    </span>
                )}
            </h2>

            {!currentTurnData && (
                <div className="flex justify-center space-x-2 mb-4">
                    <button
                        onClick={() => handleJoinTeam('operator')}
                        className="px-4 py-2 rounded shadow-md transition-all transform hover:scale-105"
                        style={{ 
                            backgroundColor: buttonColor,
                            color: 'white',
                            transition: 'all 0.2s ease',
                            fontWeight: 500
                        }}
                    >
                        Join as Operative
                    </button>
                    <button
                        onClick={() => handleJoinTeam('spymaster')}
                        className="px-4 py-2 rounded shadow-md transition-all transform hover:scale-105"
                        style={{ 
                            backgroundColor: buttonColor,
                            color: 'white',
                            transition: 'all 0.2s ease',
                            fontWeight: 500
                        }}
                    >
                        Join as Spymaster
                    </button>
                </div>
            )}

            <div>
                <h3 className="font-semibold mb-2" style={{ color: titleColor }}>Spymaster:</h3>
                {spymasters.length === 0 ? (
                    <p className="text-white/60 mb-4">No spymaster assigned</p>
                ) : (
                    <ul className="mb-4">
                        {renderTeamMembers(spymasters)}
                    </ul>
                )}

                <h3 className="font-semibold mb-2" style={{ color: titleColor }}>Operatives:</h3>
                {operators.length === 0 ? (
                    <p className="text-white/60">No operatives assigned</p>
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
