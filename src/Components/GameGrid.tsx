import { FaArrowAltCircleDown } from "react-icons/fa";
import { GameCard, UserDetails } from '../Interfaces';

// Props Interface
interface GameGridProps {
    gameGrid?: GameCard[];
    userDetails: UserDetails;
    clueSubmitted: boolean;
    handleCardClick: (cardIndex: number) => void;
}

// Represents the grid of cards for a game
function GameGrid({ gameGrid, userDetails, clueSubmitted, handleCardClick }: GameGridProps) {
    if (!gameGrid) return null;

    return (
        <div className="text-center mb-4">
            <div className="grid grid-cols-5 grid-rows-5 gap-2 max-w-screen-sm w-full">
                {/* Card types are only visible to spymaster */}
                {gameGrid.map((card, index) => (
                    <div
                        key={index}
                        className={`w-full h-28 relative rounded 
                            ${userDetails.role === 'spymaster' || card.revealed ?
                                (card.type === 'red' ? 'border-4 border-red-500' :
                                    card.type === 'blue' ? 'border-4 border-blue-500' :
                                        card.type === 'assassin' ? 'border-4 border-black' :
                                            'border-4 border-gray-500') : 'bg-gray-200'}`}
                    >
                        <img
                            src={`/codenames-cards/${card.image}`}
                            alt={`Card ${index + 1}`}
                            className="w-full h-full object-cover rounded"
                        />
                        {userDetails.role !== 'spymaster' && (
                            <div className="absolute inset-0 rounded"></div>
                        )}

                        {/* Icon that allows operators to select the card */}
                        {clueSubmitted &&
                            <div
                                className="absolute top-2 right-2 text-2xl text-black"
                                onClick={() => handleCardClick(index)}>
                                <FaArrowAltCircleDown />
                            </div>
                        }
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GameGrid;
