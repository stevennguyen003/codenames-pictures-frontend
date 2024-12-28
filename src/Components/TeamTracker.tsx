import { TeamMember, TurnData } from '../Interfaces';

// Props for Team Tracker
interface TeamTrackerProps {
    nickname: string;
    teamColor: 'red' | 'blue';
    teamMembers: TeamMember[];
    onTeamMembersUpdate?: (members: TeamMember[]) => void;
    onSelectRole: (teamColor: 'red' | 'blue', roleType: 'operator' | 'spymaster') => Promise<boolean>;
    currentTurnData: TurnData | null;
    teamPoints: number | null;
}

// Team Tracker component
function TeamTracker({
    nickname,
    teamColor,
    teamMembers,
    onTeamMembersUpdate,
    onSelectRole,
    currentTurnData,
    teamPoints
}: TeamTrackerProps) {

    // User joining a different team or role
    const handleJoinTeam = async (roleType: 'operator' | 'spymaster') => {
        const success = await onSelectRole(teamColor, roleType);
        if (success && onTeamMembersUpdate) {
            onTeamMembersUpdate(teamMembers);
        }
    };

    // Helper function to render list of team members
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

    // Filter team members based on role
    const operators = teamMembers.filter(member => member.role === 'operator');
    const spymasters = teamMembers.filter(member => member.role === 'spymaster');

    // Determine colors based on team color
    const backgroundColorClass = teamColor === 'red' ? 'bg-customRed' : 'bg-customBlue';
    const titleColorClass = teamColor === 'red' ? 'text-customTitleRed' : 'text-customTitleBlue';

    // Check if the user is already in the selected role
    const isUserInRole = (roleType: 'operator' | 'spymaster') => {
        return teamMembers.some(member => member.nickname === nickname && member.role === roleType);
    };

    // Check if a spymaster is already assigned
    const isSpymasterAssigned = spymasters.length > 0;

    return (
        <div className={`p-2 md:p-4 shadow-lg rounded-lg ${backgroundColorClass}`}>
            {/* Team color and score tracker */}
            <h2 className="text-base md:text-xl font-bold mb-2 md:mb-4 text-white flex items-center">
                {teamColor.charAt(0).toUpperCase() + teamColor.slice(1)} Team
                {teamPoints !== null && (
                    <span className="ml-2 text-sm md:text-lg font-semibold bg-white/20 px-1 md:px-2 py-1 rounded">
                        {teamPoints}
                    </span>
                )}
            </h2>

            {/* Role selection buttons */}
            {!currentTurnData && (
                <div className="flex justify-center space-x-1 md:space-x-2 mb-2 md:mb-4">
                    <button
                        onClick={() => handleJoinTeam('operator')}
                        className={`px-2 md:px-4 py-1 md:py-2 rounded shadow-md transition-all transform bg-customButton text-xs md:text-base text-white font-medium
                            ${isUserInRole('operator') ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                        disabled={isUserInRole('operator')}
                    >
                        Join as Operative
                    </button>
                    <button
                        onClick={() => handleJoinTeam('spymaster')}
                        className={`px-2 md:px-4 py-1 md:py-2 rounded shadow-md transition-all transform bg-customButton text-xs md:text-base text-white font-medium
                            ${isUserInRole('spymaster') || isSpymasterAssigned ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                        disabled={isUserInRole('spymaster') || isSpymasterAssigned}
                    >
                        Join as Spymaster
                    </button>
                </div>
            )}

            {/* Team members list */}
            <div>
                <h3 className={`font-semibold mb-1 md:mb-2 text-sm md:text-base ${titleColorClass}`}>Spymaster:</h3>
                {spymasters.length === 0 ? (
                    <p className="text-white/60 mb-2 md:mb-4 text-xs md:text-sm">No spymaster assigned</p>
                ) : (
                    <ul className="mb-2 md:mb-4 text-xs md:text-sm">
                        {renderTeamMembers(spymasters)}
                    </ul>
                )}

                <h3 className={`font-semibold mb-1 md:mb-2 text-sm md:text-base ${titleColorClass}`}>Operatives:</h3>
                {operators.length === 0 ? (
                    <p className="text-white/60 text-xs md:text-sm">No operatives assigned</p>
                ) : (
                    <ul className="text-xs md:text-sm">
                        {renderTeamMembers(operators)}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default TeamTracker;
