import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSocket } from "../Contexts/SocketContext";
import { useRoomDetails } from "../Hooks/useRoomDetails";
import { useGameLogic } from "../Hooks/useGameLogic";
import TeamTracker from "../Components/TeamTracker";
import NicknameModal from "../Components/NicknameModal";

function RoomPage() {
    const navigate = useNavigate();
    const { roomCode } = useParams();
    // Null checker
    const finalRoomCode = roomCode ?? "invalid";
    const { socket } = useSocket();

    // Use the NicknameContext to get and set the nickname
    const [nickname, setNickname] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(false);

    // Use the custom hook to fetch room details
    const roomDetails = useRoomDetails(finalRoomCode, nickname);
    // const { canGameStart, startGame, gameStarted } = useGameLogic(finalRoomCode, roomDetails, socket);
    const { canGameStart, startGame, gameStarted } = useGameLogic(finalRoomCode, roomDetails, socket);

    useEffect(() => {
        const storedNickname = localStorage.getItem('nickname');
        if (storedNickname) {
            setNickname(storedNickname);
        } else {
            setShowModal(true);
        }
    }, []);

    // Function to handle nickname submission and save it to localStorage
    const handleNicknameSubmit = (nickname: string) => {
        setNickname(nickname);
        localStorage.setItem('nickname', nickname);
        setShowModal(false);
    };

    // Ensure we have a socket before rendering
    if (!socket || finalRoomCode === "invalid") {
        return (
            <div className="h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-xl text-red-500">Error joining room</h1>
                <p className="mt-4 text-gray-600">The room code is invalid or there was an issue with the connection.</p>
                <button
                    onClick={() => navigate("/")}
                    className="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                    Go Back Home
                </button>
            </div>
        );
    }

    return (
        <div className="h-screen flex justify-between p-4">
            {/* Modal for nickname input */}
            <NicknameModal
                isVisible={showModal}
                onNicknameSubmit={handleNicknameSubmit}
                onClose={() => setShowModal(false)}
            />

            {/* Left Column: Red Team Tracker */}
            <div className="w-1/4">
                <TeamTracker
                    socket={socket}
                    roomCode={finalRoomCode}
                    nickname={nickname}
                    teamColor="red"
                    teamMembers={roomDetails.teamRed}
                />
            </div>

            {/* Middle Column: Game Content */}
            <div className="w-2/4 flex flex-col items-center">
                <h1>{nickname}</h1>
                {!gameStarted ? (
                    <div className="w-full flex flex-col items-center">
                        {canGameStart() ? (
                            <button
                                onClick={startGame}
                                className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600"
                            >
                                Start Game
                            </button>
                        ) : (
                            <div
                                className="bg-gray-300 text-gray-500 px-4 py-2 rounded mt-4 cursor-not-allowed"
                            >
                                Start Game
                            </div>
                        )}
                        <p className="mt-2 text-sm text-gray-600">
                            Requires at least 1 spymaster and 1 operator per team
                        </p>
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-center justify-center">
                        <div className="text-center mb-4">
                            <h2 className="text-xl font-bold">
                                Current Turn: {roomDetails.currentTurn?.toUpperCase()} Team
                            </h2>
                            <div className="grid grid-cols-5 grid-rows-5 gap-2 max-w-screen-sm w-full">
                                {roomDetails.gameGrid?.map((card, index) => (
                                    <div
                                        key={index}
                                        className={`w-full h-28 bg-gray-200 relative 
                                            ${card.type === 'red' ? 'border-4 border-red-500' :
                                                card.type === 'blue' ? 'border-4 border-blue-500' :
                                                    card.type === 'assassin' ? 'border-4 border-black' :
                                                        'border-4 border-gray-500'}`}
                                    >
                                        <img
                                            src={`/codenames-cards/${card.image}`}
                                            alt={`Card ${index + 1}`}
                                            className="w-full h-full object-cover rounded"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Column: Blue Team Tracker */}
            <div className="w-1/4">
                <TeamTracker
                    socket={socket}
                    roomCode={finalRoomCode}
                    nickname={nickname}
                    teamColor="blue"
                    teamMembers={roomDetails.teamBlue}
                />
            </div>
        </div>
    );
}

export default RoomPage;