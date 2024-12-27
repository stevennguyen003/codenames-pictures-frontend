import { FaArrowAltCircleDown } from "react-icons/fa";
import { GameCard, TurnData, UserDetails } from '../Interfaces';
import { GiBattleship } from "react-icons/gi";
import { GiJetFighter } from "react-icons/gi";
import { GiSheep } from "react-icons/gi";

// Props for the game grid component
interface GameGridProps {
    gameGrid?: GameCard[];
    userDetails: UserDetails;
    currentTurnData: TurnData | null;
    handleCardClick: (cardIndex: number) => void;
}

// Game grid component
function GameGrid({ gameGrid, userDetails, currentTurnData, handleCardClick }: GameGridProps) {
    if (!gameGrid) return null;

    // Get the card style based on the card type, user role, and whether it's revealed
    const getCardStyle = (card: GameCard) => {
        if (card.revealed) {
            switch (card.type) {
                case 'red':
                    return 'border-4 border-customRed';
                case 'blue':
                    return 'border-4 border-customBlue';
                case 'assassin':
                    return 'border-4 border-black';
                default:
                    return 'border-4 border-gray-500';
            }
        }
        if (userDetails.role === 'spymaster') {
            switch (card.type) {
                case 'red':
                    return 'border-4 border-customRed';
                case 'blue':
                    return 'border-4 border-customBlue';
                case 'assassin':
                    return 'border-4 border-black';
                default:
                    return 'border-4 border-gray-500';
            }
        }
        return 'bg-gray-200';
    };

    // Handling overlay color for revealed cards
    const getOverlayColor = (card: GameCard) => {
        if (card.revealed) {
            switch (card.type) {
                case 'red':
                    return 'bg-customRed';
                case 'blue':
                    return 'bg-customBlue';
                case 'assassin':
                    return 'bg-black';
                default:
                    return 'bg-gray-500';
            }
        }
        return '';
    };

    // Handling overlay icon for revealed cards
    const getCardIcon = (card: GameCard) => {
        if (!card.revealed) return null;

        switch (card.type) {
            case 'blue':
                return <GiBattleship className="w-16 h-16 text-white" />;
            case 'red':
                return <GiJetFighter className="w-16 h-16 text-white" />;
            case 'neutral':
                return <GiSheep className="w-16 h-16 text-white" />;
            default:
                return null;
        }
    };

    const canSelectCard = (card: GameCard) => {
        return (
            currentTurnData?.clueNumber &&
            userDetails.role !== 'spymaster' &&
            !card.revealed &&
            currentTurnData.currentTurn == userDetails.teamColor
        );
    };

    return (
        <div className="text-center mb-4">
            <div className="grid grid-cols-5 grid-rows-5 gap-2 max-w-screen-sm w-full">
                {gameGrid.map((card, index) => (
                    <div
                        key={index}
                        className={`w-full h-28 relative rounded ${getCardStyle(card)}`}
                    >
                        <img
                            src={`/codenames-cards/${card.image}`}
                            alt={`Card ${index + 1}`}
                            className="w-full h-full object-cover rounded"
                        />

                        {/* Solid color overlay for revealed cards */}
                        <div className={`absolute inset-0 rounded z-10 ${getOverlayColor(card)} 
                            flex items-center justify-center`}>
                            {getCardIcon(card)}
                        </div>

                        {/* Icon that allows operators to select the card */}
                        {canSelectCard(card) && (
                            <div
                                className="absolute top-2 right-2 text-2xl text-black hover:text-gray-800 z-20 cursor-pointer"
                                onClick={() => handleCardClick(index)}>
                                <FaArrowAltCircleDown />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GameGrid;
