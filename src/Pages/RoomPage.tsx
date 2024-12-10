import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useSocket } from "../SocketContext";
import TeamTracker from "../Components/TeamTracker";

// Define interfaces for team members and room details
interface TeamMember {
    nickname: string;
    id: string;
    role: 'spectator' | 'operator' | 'spymaster';
}

interface RoomDetails {
    gameLog: any[];
    users: any[];
    spectators: TeamMember[];
    teamRed: TeamMember[];
    teamBlue: TeamMember[];
}

function RoomPage() {
    const location = useLocation();
    const { nickname, roomCode } = location.state || {};
    const { socket } = useSocket();
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    
    // State to store room details
    const [roomDetails, setRoomDetails] = useState<RoomDetails>({
        gameLog: [],
        users: [],
        spectators: [],
        teamRed: [],
        teamBlue: []
    });

    // Refs for team members to maintain persistence
    const redTeamMembersRef = useRef<TeamMember[]>([]);
    const blueTeamMembersRef = useRef<TeamMember[]>([]);

    // Helper to generate 25 unique random numbers for selecting cards
    const getRandomNumbers = (min: number, max: number, count: number) => {
        const numbers = new Set();
        while (numbers.size < count) {
            const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
            numbers.add(randomNumber);
        }
        return Array.from(numbers);
    }

    // Randomly fetch images for game
    const fetchImages = () => {
        const randomNumbers = getRandomNumbers(1, 279, 25);
        const randomImages = randomNumbers.map((num) => `card-${num}.jpg`);
        setSelectedImages(randomImages);
    }

    // Function to fetch room details
    const fetchRoomDetails = () => {
        if (!socket || !roomCode) return;

        socket.emit('join room', roomCode, nickname, (gameLog: any[], roomInfo: any) => {
            if (roomInfo.success) {
                console.log("Room Details: ", roomDetails);
                setRoomDetails({
                    gameLog: gameLog || [],
                    users: roomInfo.users || [],
                    spectators: roomInfo.spectators || [],
                    teamRed: roomInfo.teamRed || [],
                    teamBlue: roomInfo.teamBlue || []
                });

                // Update refs with initial team data
                redTeamMembersRef.current = roomInfo.teamRed || [];
                blueTeamMembersRef.current = roomInfo.teamBlue || [];
            }
        });
    }

    // Update team members function
    const updateTeamMembers = (teamColor: 'red' | 'blue', members: TeamMember[]) => {
        if (teamColor === 'red') {
            redTeamMembersRef.current = members;
            setRoomDetails(prev => ({ ...prev, teamRed: members }));
        } else {
            blueTeamMembersRef.current = members;
            setRoomDetails(prev => ({ ...prev, teamBlue: members }));
        }
    }

    useEffect(() => {
        console.log(socket?.id);
        fetchImages();
        fetchRoomDetails();

        // Listen for team updates
        socket?.on('team updated', (data) => {
            setRoomDetails(prev => ({
                ...prev,
                spectators: data.spectators,
                teamRed: data.teamRed,
                teamBlue: data.teamBlue
            }));

            // Update refs
            redTeamMembersRef.current = data.teamRed;
            blueTeamMembersRef.current = data.teamBlue;
        });

        // Cleanup
        return () => {
            socket?.off('team updated');
        };
    }, [socket, roomCode]);

    // Ensure we have a socket before rendering
    if (!socket) return <div>Loading...</div>;

    return (
        <div className="h-screen flex justify-between p-4">
            {/* Left Column: Red Team Tracker */}
            <div className="w-1/4">
                <TeamTracker
                    socket={socket}
                    roomCode={roomCode}
                    nickname={nickname}
                    teamColor="red"
                    teamMembersRef={redTeamMembersRef}
                    onTeamMembersUpdate={(members) => updateTeamMembers('red', members)}
                />
            </div>

            {/* Middle Column: Game Images */}
            <div className="w-2/4 flex flex-col items-center">
                <h1>Nickname: {nickname}</h1>
                <div className="grid grid-cols-5 grid-rows-5 gap-2 max-w-screen-sm w-full">
                    {selectedImages.map((image, index) => (
                        <div key={index} className="w-full h-32 bg-gray-200">
                            <img
                                src={`/codenames-cards/${image}`}
                                alt={`Card ${index + 1}`}
                                className="w-full h-full object-cover rounded"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Column: Blue Team Tracker */}
            <div className="w-1/4">
                <TeamTracker
                    socket={socket}
                    roomCode={roomCode}
                    nickname={nickname}
                    teamColor="blue"
                    teamMembersRef={blueTeamMembersRef}
                    onTeamMembersUpdate={(members) => updateTeamMembers('blue', members)}
                />
            </div>
        </div>
    );
}

export default RoomPage;