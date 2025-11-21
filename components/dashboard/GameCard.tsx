
import React from 'react';
import { Game, GameType, UserData } from '../../types';
import { Button } from '../ui/Button';
import { useAppContext } from '../../contexts/AppContext';

interface GameCardProps {
    game: Game;
    userData: UserData;
}

const GameCard: React.FC<GameCardProps> = ({ game, userData }) => {
    const { setCurrentGame, t } = useAppContext();
    const today = new Date().toISOString().split('T')[0];
    const lastPlayedDate = userData.lastPlayed[game.id];
    const playCount = lastPlayedDate === today ? userData.playCounts[game.id] : 0;
    const playsLeft = 10 - playCount;
    const canPlay = playsLeft > 0;

    return (
        <div className="bg-secondary p-6 rounded-lg shadow-md flex flex-col justify-between transform hover:scale-105 transition-transform duration-300">
            <div>
                <h3 className="text-2xl font-bold text-accent mb-2">{t(`game_${game.id}_name` as any)}</h3>
                <p className="text-dark-text mb-4">{t(`game_${game.id}_desc` as any)}</p>
            </div>
            <div className="mt-auto">
                <div className="text-center text-light-text mb-4">
                    <span className="font-semibold">{playsLeft}</span> {t('dailyPlaysLeft')}
                </div>
                <Button 
                    className="w-full" 
                    onClick={() => setCurrentGame(game.id)}
                    disabled={!canPlay}
                >
                    {canPlay ? t('playNow') : t('noPlaysLeft')}
                </Button>
            </div>
        </div>
    );
};

export default GameCard;
