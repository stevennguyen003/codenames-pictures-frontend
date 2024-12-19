import { useState } from 'react';
import { UserDetails } from '../Interfaces';

interface ClueFormProps {
    userDetails: UserDetails;
    socket: any;
    roomCode: string;
    clueSubmitted: boolean;
    setClueSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}

function ClueForm({ userDetails, socket, roomCode, clueSubmitted, setClueSubmitted }: ClueFormProps) {
    const [clue, setClue] = useState('');
    const [number, setNumber] = useState<number | string>('');

    const handleClueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClue(event.target.value);
    };

    const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Ensure only numbers are entered
        const value = event.target.value;
        setNumber(value === '' ? '' : parseInt(value, 10));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate inputs
        if (!clue || number === '') {
            alert("Please enter both a clue and number");
            return;
        }

        // Emit clue submission event
        if (socket) {
            socket.emit('submit clue', roomCode, clue, number, (response: any) => {
                if (response.success) {
                    setClue('');
                    setNumber('');
                    setClueSubmitted(true);
                    console.log("Clue submitted");
                } else {
                    alert(response.error || "Failed to submit clue");
                }
            });
        }
    }

    // If the user is a spymaster, show the input fields for clue and number
    if (userDetails.role === 'spymaster') {
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

    const teamColorClass = userDetails.teamColor === 'red' ? 'text-red-500' : 'text-blue-500';

    // If the user is an operator, show the waiting message
    return (
        <div className="w-full flex flex-col items-center justify-center">
            <p className={`text-gray-500 ${teamColorClass} text-lg`}>Waiting for spymaster to give a clue</p>
        </div>
    );
}

export default ClueForm;