import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSocket } from "../Hooks/useSocket";
import { useRoomDetails } from "../Hooks/useRoomDetails";
import { useGameLogic } from "../Hooks/useGameLogic";
import TeamTracker from "../Components/TeamTracker";
import GameGrid from "../Components/GameGrid";
import ClueForm from "../Components/ClueForm";
import NicknameModal from "../Components/NicknameModal";

// Room Page for game room
function RoomPage() {
    const { socket } = useSocket();
    const navigate = useNavigate();
    const { roomCode } = useParams();
    const finalRoomCode = roomCode ?? "invalid";
    const [nickname, setNickname] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(false);

    const { roomDetails, selectTeamRole, userDetails } = useRoomDetails(finalRoomCode, nickname);
    const { canGameStart, startGame, resetGame, handleCardClick, gameOver, winner } = useGameLogic(finalRoomCode, roomDetails, socket);

    useEffect(() => {
        const storedNickname = localStorage.getItem('nickname');
        if (storedNickname) {
            setNickname(storedNickname);
        } else {
            setShowModal(true);
        }
        console.log("Nickname: ", storedNickname);
    }, []);

    // Handle nickname submission for modal
    const handleNicknameSubmit = (nickname: string) => {
        setNickname(nickname);
        localStorage.setItem('nickname', nickname);
        setShowModal(false);
    };

    // Error handling for invalid room code
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
        <div className="h-screen flex flex-col md:flex-row justify-between p-4">
            <NicknameModal
                isVisible={showModal}
                onNicknameSubmit={handleNicknameSubmit}
                onClose={() => setShowModal(false)}
            />

            {/* Left Team Tracker - Hidden on mobile, visible on md+ screens */}
            <div className="hidden md:block md:w-1/4">
                <TeamTracker
                    nickname={nickname}
                    teamColor="red"
                    teamMembers={roomDetails.teamRed}
                    onSelectRole={selectTeamRole}
                    currentTurnData={roomDetails.currentTurnData}
                    teamPoints={roomDetails.teamRedPoints}
                />
            </div>

            {/* Middle Column - Full width on mobile, 2/4 on md+ screens */}
            <div className="w-full md:w-2/4 flex flex-col items-center">
                {!roomDetails.gameStarted && (
                    <>
                        {canGameStart() ? (
                            <button
                                onClick={startGame}
                                className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600"
                            >
                                Start Game
                            </button>
                        ) : (
                            <div className="bg-gray-300 text-gray-500 px-4 py-2 rounded mt-4 cursor-not-allowed">
                                Start Game
                            </div>
                        )}
                        <p className="mt-2 text-sm text-gray-600">
                            Requires at least 1 spymaster and 1 operator per team
                        </p>
                    </>
                )}

                {roomDetails.gameStarted && (
                    <div className="w-full flex flex-col items-center justify-center">
                        <GameGrid
                            gameGrid={roomDetails.gameGrid}
                            userDetails={userDetails}
                            currentTurnData={roomDetails.currentTurnData}
                            handleCardClick={handleCardClick}
                        />
                        {roomDetails.currentTurnData && (
                            <ClueForm
                                userDetails={userDetails}
                                socket={socket}
                                roomCode={finalRoomCode}
                                currentTurnData={roomDetails.currentTurnData}
                            />
                        )}
                    </div>
                )}

                {gameOver && !roomDetails.gameStarted && (
                    <h1 className="text-4xl font-bold mt-8">
                        {winner?.toUpperCase()} TEAM WINS!
                    </h1>
                )}
            </div>

            {/* Right Team Tracker - Hidden on mobile, visible on md+ screens */}
            <div className="hidden md:block md:w-1/4">
                <TeamTracker
                    nickname={nickname}
                    teamColor="blue"
                    teamMembers={roomDetails.teamBlue}
                    onSelectRole={selectTeamRole}
                    currentTurnData={roomDetails.currentTurnData}
                    teamPoints={roomDetails.teamBluePoints}
                />
                <button 
                    onClick={resetGame}
                    className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Reset Game
                </button>
            </div>

            {/* Mobile Team Trackers - Visible only on small screens */}
            <div className="md:hidden w-full flex flex-col justify-end flex-grow mt-4">
                <div className="flex">
                    <div className="w-1/2 pr-2">
                        <TeamTracker
                            nickname={nickname}
                            teamColor="red"
                            teamMembers={roomDetails.teamRed}
                            onSelectRole={selectTeamRole}
                            currentTurnData={roomDetails.currentTurnData}
                            teamPoints={roomDetails.teamRedPoints}
                        />
                    </div>
                    <div className="w-1/2 pl-2">
                        <TeamTracker
                            nickname={nickname}
                            teamColor="blue"
                            teamMembers={roomDetails.teamBlue}
                            onSelectRole={selectTeamRole}
                            currentTurnData={roomDetails.currentTurnData}
                            teamPoints={roomDetails.teamBluePoints}
                        />
                    </div>
                </div>
                <div className="w-full mt-4">
                    <button 
                        onClick={resetGame}
                        className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Reset Game
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RoomPage;
