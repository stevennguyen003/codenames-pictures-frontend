import { useState, useEffect } from 'react';

interface ClueAlertProps {
    currentTurnData?: {
        team: string;
        currentClue: string;
        clueNumber: number;
        correctCardsClicked: number;
        turnEnded: boolean;
    } | null;
}

function ClueAlert({ currentTurnData }: ClueAlertProps) {
    const [visible, setVisible] = useState(true);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Reset states when new clue comes in
        setVisible(true);
        setIsExiting(false);

        // Start exit animation after 4.5 seconds
        const animationTimer = setTimeout(() => {
            setIsExiting(true);
        }, 4500);

        // Hide component after 5 seconds
        const hideTimer = setTimeout(() => {
            setVisible(false);
        }, 5000);

        return () => {
            clearTimeout(animationTimer);
            clearTimeout(hideTimer);
        };
    }, [currentTurnData]);

    if (!currentTurnData || !visible) {
        return null;
    }

    return (
        <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 
            ${isExiting ? 'opacity-0 -translate-y-full' : 'opacity-100'}`}>
            <div className={`bg-${currentTurnData.team}-600 text-white px-6 py-4 rounded-lg shadow-lg 
                flex items-center space-x-3 min-w-[300px]`}>
                <div className="flex flex-col">
                    <div className="font-semibold text-lg">
                        New Clue!
                    </div>
                    <div>
                        "{currentTurnData.currentClue}" - {currentTurnData.clueNumber} card(s)
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ClueAlert;