
import React, { useState, useEffect, useCallback } from 'react';
import { CoinIcon } from '../ui/icons';

interface Coin {
    id: number;
    x: number;
    y: number;
    size: number;
}

const CoinClicker: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [coins, setCoins] = useState<Coin[]>([]);
    const [gameStarted, setGameStarted] = useState(false);

    useEffect(() => {
        if (!gameStarted) return;
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            onGameEnd(score);
        }
    }, [timeLeft, onGameEnd, score, gameStarted]);

    useEffect(() => {
        if (!gameStarted) return;
        const interval = setInterval(() => {
            if (coins.length < 15) {
                setCoins(prevCoins => [
                    ...prevCoins,
                    {
                        id: Date.now(),
                        x: Math.random() * 90,
                        y: -10, // Start above screen
                        size: Math.random() * 20 + 25,
                    }
                ]);
            }
        }, 500);
        return () => clearInterval(interval);
    }, [coins.length, gameStarted]);

    const handleCoinClick = (id: number) => {
        setScore(score + 10);
        setCoins(coins.filter(coin => coin.id !== id));
    };

    if (!gameStarted) {
        return (
             <div className="text-center">
                <h2 className="text-4xl font-bold text-accent mb-4">Coin Clicker</h2>
                <p className="text-lg text-dark-text mb-8">Click the falling coins!</p>
                <button onClick={() => setGameStarted(true)} className="px-8 py-4 bg-accent text-primary font-bold rounded-lg text-2xl hover:bg-accent-dark transition-colors">Start Game</button>
            </div>
        )
    }

    return (
        <div className="w-full h-full bg-secondary relative overflow-hidden flex flex-col items-center p-4">
            <div className="absolute top-4 right-4 bg-primary px-4 py-2 rounded-lg text-2xl font-bold z-10">
                Time: {timeLeft}s | Score: {score}
            </div>
            {coins.map((coin) => (
                <div
                    key={coin.id}
                    className="absolute transition-all duration-5000 ease-linear top-[-50px]"
                    style={{ 
                        left: `${coin.x}%`, 
                        animation: `float ${Math.random() * 2 + 2}s ease-in-out infinite, fall-down 5s linear forwards`,
                        width: `${coin.size}px`,
                        height: `${coin.size}px`,
                    }}
                    onClick={() => handleCoinClick(coin.id)}
                >
                    <CoinIcon className="w-full h-full text-yellow-400 cursor-pointer animate-pulse" />
                </div>
            ))}
            <style>
            {`
                @keyframes fall-down {
                    from { transform: translateY(-10vh); }
                    to { transform: translateY(110vh); }
                }
            `}
            </style>
        </div>
    );
};

export default CoinClicker;
