import React, { useState, useEffect, useRef } from 'react';

const ReactionGame: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [position, setPosition] = useState(0);
    const [direction, setDirection] = useState(1);
    const [speed, setSpeed] = useState(2);
    const [gameStarted, setGameStarted] = useState(false);
    const requestRef = useRef<number>();

    // FIX: The callback for requestAnimationFrame should accept one argument (a timestamp).
    const animate = (_time: number) => {
        setPosition(prev => {
            const newPos = prev + direction * speed;
            if (newPos > 100 || newPos < 0) {
                setDirection(dir => -dir);
                return prev;
            }
            return newPos;
        });
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (gameStarted) {
            requestRef.current = requestAnimationFrame(animate);
        }
        return () => {
            if(requestRef.current) cancelAnimationFrame(requestRef.current);
        }
    }, [gameStarted, direction, speed]);


    useEffect(() => {
        if (!gameStarted) return;
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            if(requestRef.current) cancelAnimationFrame(requestRef.current);
            onGameEnd(score);
        }
    }, [timeLeft, onGameEnd, score, gameStarted]);

    const handleTap = () => {
        if (position >= 40 && position <= 60) {
            setScore(s => s + 20);
            setSpeed(s => s * 1.05); // Increase difficulty
        } else {
            setScore(s => Math.max(0, s - 5));
        }
    };
    
    if (!gameStarted) {
        return (
             <div className="text-center">
                <h2 className="text-4xl font-bold text-accent mb-4">Reaction Test</h2>
                <p className="text-lg text-dark-text mb-8">Click when the bar is in the green zone!</p>
                <button onClick={() => setGameStarted(true)} className="px-8 py-4 bg-accent text-primary font-bold rounded-lg text-2xl hover:bg-accent-dark transition-colors">Start Game</button>
            </div>
        )
    }

    return (
        <div className="w-full h-full bg-secondary flex flex-col items-center justify-center p-4" onClick={handleTap}>
            <div className="absolute top-4 right-4 bg-primary px-4 py-2 rounded-lg text-2xl font-bold z-10">
                Time: {timeLeft}s | Score: {score}
            </div>
            
            <div className="w-full max-w-2xl">
                <p className="text-center text-2xl mb-4 text-light-text">Tap anywhere!</p>
                <div className="relative h-12 bg-primary rounded-lg overflow-hidden">
                    {/* Target zone */}
                    <div className="absolute h-full bg-green-500/50" style={{ left: '40%', width: '20%' }}></div>
                    {/* Bar */}
                    <div className="absolute h-full w-2 bg-accent" style={{ left: `${position}%` }}></div>
                </div>
            </div>
        </div>
    );
};

export default ReactionGame;
