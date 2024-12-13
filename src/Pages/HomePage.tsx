import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../Contexts/SocketContext";

function HomePage() {
    const [nickname, setNickname] = useState<string>("");
    const [roomCode, setRoomCode] = useState("");
    const { socket, sessionId } = useSocket();
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate inputs
        if (!nickname || !roomCode) {
            alert("Please enter both nickname and room code");
            return;
        }

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
                console.log(roomInfo);
                navigate(`/room/${roomCode}`);
            } else {
                alert("Failed to join room")
            }
        });
    }

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <h1 className="text-4xl text-gray-500 font-bold mb-6">CodeNames 🤔</h1>
            <form className="w-full max-w-sm" onSubmit={handleSubmit}>
                <div className="mb-6">
                    <div>
                        <input 
                            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-purple-500"
                            id="inline-full-name"
                            type="text"
                            placeholder="nickname"
                            value={nickname}
                            onChange={(e) => { setNickname(e.target.value) }}
                        />
                    </div>
                </div>
                <div className="mb-6">
                    <div>
                        <input 
                            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-purple-500"
                            type="text"
                            placeholder="have a room code?"
                            value={roomCode}
                            onChange={(e) => { setRoomCode(e.target.value) }}
                        />
                    </div>
                </div>
                <div>
                    <div className="md:w-1/3"></div>
                    <div className="md:w-2/3">
                        <button 
                            className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" 
                            type="submit"
                        >
                            Join Room
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default HomePage;