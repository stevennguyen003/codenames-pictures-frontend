import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSocket } from "../SocketContext";
import TeamTracker from "../Components/TeamTracker";

function RoomPage() {
    const location = useLocation();
    const { nickname, roomCode, gameLog, response } = location.state || {};
    const { socket } = useSocket();
    const [selectedImages, setSelectedImages] = useState<string[]>([]);

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
        // 25 random indices
        const randomNumbers = getRandomNumbers(1, 279, 25);
        const randomImages = randomNumbers.map((num) => `card-${num}.jpg`);
        setSelectedImages(randomImages);
    }

    useEffect(() => {
        fetchImages();
    }, []);

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
                />
            </div>

            {/* Middle Column: Game Images */}
            <div className="w-2/4 grid grid-cols-5 grid-rows-5 gap-2 max-w-screen-sm w-full">
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

            {/* Right Column: Blue Team Tracker */}
            <div className="w-1/4">
                <TeamTracker
                    socket={socket}
                    roomCode={roomCode}
                    nickname={nickname}
                    teamColor="blue"
                />
            </div>
        </div>
    );
}

export default RoomPage;