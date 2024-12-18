import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSocket } from "../Contexts/SocketContext";
import { useRoomDetails } from "../Hooks/useRoomDetails";
import { useGameLogic } from "../Hooks/useGameLogic";
import TeamTracker from "../Components/TeamTracker";
import NicknameModal from "../Components/NicknameModal";
import GameGrid from "../Components/GameGrid";
import ClueForm from "../Components/ClueForm";

// Displays a room page
function RoomPage() {
    const navigate = useNavigate();
    const { roomCode } = useParams();
    const finalRoomCode = roomCode ?? "invalid";
    const { socket } = useSocket();
    const [nickname, setNickname] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(false);

    // Use custom hook to fetch room details
    const { roomDetails, selectTeamRole, joinError, userDetails } = useRoomDetails(finalRoomCode, nickname);
    console.log("Room Details: ", roomDetails);
    const { canGameStart, startGame, gameStarted, handleCardClick, clueSubmitted, setClueSubmitted } = useGameLogic(finalRoomCode, roomDetails, socket);

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
                    nickname={nickname}
                    teamColor="red"
                    teamMembers={roomDetails.teamRed}
                    onSelectRole={selectTeamRole}
                    joinError={joinError}
                    gameStarted={gameStarted}
                    teamPoints={roomDetails.teamRedPoints}
                />
            </div>

            {/* Middle Column: Game Content */}
            <div className="w-2/4 flex flex-col items-center">
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
                        <GameGrid
                            gameGrid={roomDetails.gameGrid}
                            userDetails={userDetails}
                            clueSubmitted={clueSubmitted}
                            handleCardClick={handleCardClick}
                        />
                        {!clueSubmitted &&
                            <ClueForm
                                userDetails={userDetails}
                                socket={socket}
                                roomCode={finalRoomCode}
                                setClueSubmitted={setClueSubmitted}
                            />
                        }
                    </div>
                )}
            </div>

            {/* Right Column: Blue Team Tracker */}
            <div className="w-1/4">
                <TeamTracker
                    nickname={nickname}
                    teamColor="blue"
                    teamMembers={roomDetails.teamBlue}
                    onSelectRole={selectTeamRole}
                    joinError={joinError}
                    gameStarted={gameStarted}
                    teamPoints={roomDetails.teamBluePoints}
                />
            </div>
        </div>
    );
}

export default RoomPage;