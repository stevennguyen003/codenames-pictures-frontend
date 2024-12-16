import { useState } from "react";

interface NicknameModalProps {
    isVisible: boolean;
    onNicknameSubmit: (nickname: string) => void;
    onClose: () => void;
}

function NicknameModal({ isVisible, onNicknameSubmit, onClose }: NicknameModalProps) {
    const [localNickname, setLocalNickname] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleSubmit = () => {
        if (localNickname.trim()) {
            setError("");
            onNicknameSubmit(localNickname);
        } else {
            setError("Nickname cannot be empty.");
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-80">
                <h2 className="text-xl font-bold mb-4">Enter Your Nickname</h2>
                <input
                    type="text"
                    className="border-2 border-gray-300 p-2 w-full rounded mb-4"
                    value={localNickname}
                    onChange={(e) => setLocalNickname(e.target.value)} // Update local state
                    placeholder="Enter nickname"
                />
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>} {/* Error message */}
                <div className="flex justify-between">
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Submit
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
export default NicknameModal;
