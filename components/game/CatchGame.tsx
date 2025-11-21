
import React, { useState, useEffect, useRef } from 'react';

type ItemType = 'good' | 'bad';
interface FallingItem {
    id: number;
    x: number;
    y: number;
    type: ItemType;
}

const CatchGame: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [catcherX, setCatcherX] = useState(50);
    const [items, setItems] = useState<FallingItem[]>([]);
    const [gameStarted, setGameStarted] = useState(false);
    const gameAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!gameStarted) return;
        const handleMouseMove = (e: MouseEvent) => {
            if (gameAreaRef.current) {
                const rect = gameAreaRef.current.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                setCatcherX(Math.max(5, Math.min(95, x)));
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [gameStarted]);
    
    useEffect(() => {
        if (!gameStarted) return;
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            const itemFallInterval = setInterval(() => {
                setItems(prevItems => {
                    const newItems = prevItems.map(item => ({ ...item, y: item.y + 5 })).filter(item => item.y < 100);
                    // Collision detection
                    newItems.forEach(item => {
                         if (item.y > 85 && Math.abs(item.x - catcherX) < 7) {
                            if (item.type === 'good') setScore(s => s + 10);
                            else setScore(s => Math.max(0, s - 5));
                            // Remove item
                            newItems.splice(newItems.findIndex(i => i.id === item.id), 1);
                        }
                    });
                    return newItems;
                });
            }, 50);

            const itemSpawnInterval = setInterval(() => {
                setItems(prev => [
                    ...prev,
                    {
                        id: Date.now(),
                        x: Math.random() * 90 + 5,
                        y: 0,
                        type: Math.random() > 0.3 ? 'good' : 'bad',
                    }
                ]);
            }, 600);
            
            return () => {
                clearTimeout(timer);
                clearInterval(itemFallInterval);
                clearInterval(itemSpawnInterval);
            };
        } else {
            onGameEnd(score);
        }
    }, [timeLeft, score, onGameEnd, catcherX, gameStarted]);

     if (!gameStarted) {
        return (
             <div className="text-center">
                <h2 className="text-4xl font-bold text-accent mb-4">Item Catcher</h2>
                <p className="text-lg text-dark-text mb-8">Catch gems (💎), avoid bombs (💣)!</p>
                <button onClick={() => setGameStarted(true)} className="px-8 py-4 bg-accent text-primary font-bold rounded-lg text-2xl hover:bg-accent-dark transition-colors">Start Game</button>
            </div>
        )
    }

    return (
        <div ref={gameAreaRef} className="w-full h-full bg-secondary relative overflow-hidden flex flex-col items-center p-4 cursor-none">
            <div className="absolute top-4 right-4 bg-primary px-4 py-2 rounded-lg text-2xl font-bold z-10">
                Time: {timeLeft}s | Score: {score}
            </div>
            
            {/* Items */}
            {items.map(item => (
                <div key={item.id} className="absolute text-3xl" style={{ left: `${item.x}%`, top: `${item.y}%`, transform: 'translateX(-50%)' }}>
                    {item.type === 'good' ? '💎' : '💣'}
                </div>
            ))}

            {/* Catcher */}
            <div className="absolute bottom-5 text-5xl" style={{ left: `${catcherX}%`, transform: 'translateX(-50%)' }}>
                🧺
            </div>
        </div>
    );
};

export default CatchGame;
