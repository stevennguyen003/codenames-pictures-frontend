import { useState } from 'react';
import { UserDetails } from '../Interfaces';

interface ClueFormProps {
    userDetails: UserDetails;
}

function ClueForm({ userDetails }: ClueFormProps) {
    const [clue, setClue] = useState('');
    const [number, setNumber] = useState<number | string>('');

    const handleClueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClue(event.target.value);
    };

    const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumber(event.target.value);
    };

    // If the user is a spymaster, show the input fields for clue and number
    if (userDetails.role === 'spymaster') {
        return (
            <div className="w-full max-w-md flex flex-row justify-center gap-2 rounded">
                <input
                    type="text"
                    placeholder="Clue"
                    value={clue}
                    onChange={handleClueChange}
                    className="px-4 py-2 border border-gray-300 rounded w-2/3"
                />
                <input
                    type="number"
                    placeholder="#"
                    value={number}
                    onChange={handleNumberChange}
                    className="px-2 py-1 border border-gray-300 rounded text-sm w-1/6"
                />
                <button
                    onClick={() => {
                        // Handle clue submission (you can implement this functionality as needed)
                        console.log('Clue:', clue, 'Number:', number);
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm w-1/6"
                >
                    Submit
                </button>
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
