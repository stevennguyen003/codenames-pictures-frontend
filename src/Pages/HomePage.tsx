import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../Hooks/useSocket";

// Home page displayed on landing
function HomePage() {
    const [nickname, setNickname] = useState<string>("");
    const [roomCode, setRoomCode] = useState("");
    const [nicknameError, setNicknameError] = useState<string>("");
    const [roomCodeError, setRoomCodeError] = useState<string>("");
    const [joinRoomError, setJoinRoomError] = useState<boolean>(false);
    const { socket, sessionId } = useSocket();
    const navigate = useNavigate();

    // Handle form submission with new user
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setNicknameError("");
        setRoomCodeError("");

        // Error handling for empty fields
        let hasError = false;
        if (!nickname) {
            setNicknameError("please give a nickname!");
            hasError = true;
        }
        if (!roomCode) {
            setRoomCodeError("please enter a room code!");
            hasError = true;
        }
        if (hasError) return;

        // Ensure socket is connected before emitting events
        if (!socket || !socket.connected) {
            alert("Socket connection lost. Please refresh.");
            return;
        }

        // Store nickname in localStorage
        localStorage.setItem('nickname', nickname);
        // Emit join server event with session ID
        socket.emit("join server", nickname, sessionId);

        // Join specific room with updated callback
        socket.emit("join room", roomCode, nickname, (gameLog: any[], roomInfo: any) => {
            if (roomInfo.success) {
                navigate(`/room/${roomCode}`);
            } else {
                setJoinRoomError(true);
            }
        });
    }

    return (
        <div className="min-h-screen w-full px-4 flex flex-col items-center justify-center">
            <h1 className="text-3xl md:text-4xl text-gray-500 font-bold mb-1">CodeNames 🤔</h1>
            <form
                className="w-full max-w-[280px] sm:max-w-sm relative"
                onSubmit={handleSubmit}
            >
                <div className="mb-1 relative pt-5">
                    {nicknameError && (
                        <span
                            className="absolute top-0 left-0 text-sm text-gray-500 font-comic" 
                        >
                            {nicknameError}
                        </span>
                    )}
                    <input
                        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 md:px-4 text-gray-700 leading-tight focus:outline-none focus:border-customRed"
                        id="inline-full-name"
                        type="text"
                        placeholder="nickname"
                        value={nickname}
                        onChange={(e) => {
                            setNickname(e.target.value);
                            setNicknameError("");
                        }}
                    />
                </div>
                <div className="mb-3 relative pt-5">
                    {roomCodeError && (
                        <span
                            className="absolute top-0 left-0 text-sm text-gray-500 font-comic"
                        >
                            {roomCodeError}
                        </span>
                    )}
                    <input
                        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 md:px-4 text-gray-700 leading-tight focus:outline-none focus:border-customBlue mb-3"
                        type="text"
                        placeholder="have a room code?"
                        value={roomCode}
                        onChange={(e) => {
                            setRoomCode(e.target.value);
                            setRoomCodeError("");
                        }}
                    />
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
                        <button
                            className="w-full sm:w-auto px-4 py-2 rounded shadow-md transition-all transform hover:scale-105 bg-customButton text-white font-medium"
                            type="submit"
                        >
                            Join Room
                        </button>
                        <span
                            className={`text-xs font-medium max-w-[150px] leading-tight text-center sm:text-right sm:ml-4 ${joinRoomError ? 'text-red-500' : 'text-gray-500'} font-comic`}
                            style={{
                                transform: "rotate(-2deg)",
                            }}
                        >
                            {joinRoomError ? "failed to join a room :(" : "we'll create a new room for you if needed :)"}
                        </span>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default HomePage;