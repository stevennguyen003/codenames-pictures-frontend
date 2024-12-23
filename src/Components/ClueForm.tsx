import { useState } from 'react';
import { UserDetails, TurnData } from '../Interfaces';
import { gameEmitters } from '../Sockets/Emitters/gameEmitters';

interface ClueFormProps {
    userDetails: UserDetails;
    socket: any;
    roomCode: string;
    currentTurnData: TurnData;
}

// Represents clue input and clue display
function ClueForm({ userDetails, socket, roomCode, currentTurnData }: ClueFormProps) {
    const [clue, setClue] = useState('');
    const [number, setNumber] = useState<number | string>('');

    const handleClueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClue(event.target.value);
    };

    const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setNumber(value === '' ? '' : parseInt(value, 10));
    };

    // Clue submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!clue || number === '' || !socket) {
            alert("Please enter both a clue and number");
            return;
        }

        try {
            const response = await gameEmitters.submitClue(socket, roomCode, clue, Number(number));
            if (response.success) {
                setClue('');
                setNumber('');
            } else {
                alert(response.error || "Failed to submit clue");
            }
        } catch (error) {
            console.error("Error submitting clue:", error);
            alert("Failed to submit clue");
        }
    }

    // If there's a current clue, show it
    if (currentTurnData.currentClue) {
        return (
            <div className="w-full flex flex-col items-center justify-center">
                <div className="text-black text-lg font-medium">
                    Current Clue: {currentTurnData.currentClue} ({currentTurnData.clueNumber})
                </div>
            </div>
        );
    }

    // If user is spymaster and it's their team's turn, show the input form
    if (userDetails.role === 'spymaster' && currentTurnData.team === userDetails.teamColor) {
        return (
            <div className="w-full max-w-md flex justify-center rounded">
                <form onSubmit={handleSubmit} className="w-full flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Clue"
                        value={clue}
                        onChange={handleClueChange}
                        className="px-4 py-1 border border-gray-300 rounded w-2/3 h-10"
                    />
                    <input
                        type="number"
                        placeholder="#"
                        min="1"
                        value={number}
                        onChange={handleNumberChange}
                        className="px-4 py-1 border border-gray-300 rounded text-sm w-1/6 h-10"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 text-sm w-1/6 h-10"
                    >
                        Submit
                    </button>
                </form>
            </div>
        );
    }

    // Default waiting state
    return (
        <div className="w-full flex flex-col items-center justify-center">
            {userDetails.teamColor === currentTurnData.team ? (
                <p className="text-lg text-black">Waiting for your spymaster to give a clue</p>
            ) : (
                <p className="text-lg text-black">Waiting for enemy spymaster to give a clue</p>
            )}
        </div>

    );
}

export default ClueForm;