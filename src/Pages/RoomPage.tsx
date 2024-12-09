import { useState, useEffect } from "react";

function RoomPage() {
    const [selectedImages, setSelectedImages] = useState<string[]>([]);;

    // Helper to generate 25 unique random numbers for selecting cards
    const getRandomNumbers = (min: number, max: number, count: number) => {
        const numbers = new Set();
        while (numbers.size < count) {
            const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
            numbers.add(randomNumber);
        }
        return Array.from(numbers);
    }

    // Randomly fetch images for game
    const fetchImages = () => {
        // 25 random indices
        const randomNumbers = getRandomNumbers(1, 279, 25);
        const randomImages = randomNumbers.map((num) => `card-${num}.jpg`);
        setSelectedImages(randomImages);
    }

    useEffect(() => {
        fetchImages();
    }, []);

    return (
        <div className="h-screen flex flex-col items-center justify-center p-4">
            <div className="grid grid-cols-5 grid-rows-5 gap-2 max-w-screen-sm w-full">
                {selectedImages.map((image, index) => (
                    <div key={index} className="w-full h-32 bg-gray-200">
                        <img
                        src={`/codenames-cards/${image}`}
                        alt={`Card ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                        />
                    </div>
                ))}
            </div>
            {/* <img src="/codenames-cards/card-0.jpg"/> */}
            <div>

            </div>
        </div>
    );
}
export default RoomPage;