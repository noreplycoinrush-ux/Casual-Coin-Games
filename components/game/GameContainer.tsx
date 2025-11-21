
import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { GameType, UserData } from '../../types';
import CoinClicker from './CoinClicker';
import CatchGame from './CatchGame';
import ReactionGame from './ReactionGame';
import AdModal from './AdModal';
import { updateUserCoinsAndPlays } from '../../services/firebaseService';

const GameComponentMap: { [key in GameType]: React.FC<{ onGameEnd: (score: number) => void }> } = {
    COIN_CLICKER: CoinClicker,
    CATCH_GAME: CatchGame,
    REACTION_GAME: ReactionGame,
};

const GameContainer: React.FC = () => {
    const { currentGame, setCurrentGame, user, updateUserData, t } = useAppContext();
    const [score, setScore] = useState(0);
    const [showAdModal, setShowAdModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!currentGame || !user) {
        return null;
    }

    const SelectedGame = GameComponentMap[currentGame];

    const handleGameEnd = (finalScore: number) => {
        setScore(finalScore);
        setShowAdModal(true);
    };

    const handleAdModalClose = async (adClicked: boolean) => {
        setShowAdModal(false);
        setIsSubmitting(true);
        const baseReward = 100;
        const adBonus = adClicked ? 200 : 0;
        const totalCoins = score + baseReward + adBonus;

        try {
            const newTotalCoins = await updateUserCoinsAndPlays(user.uid, currentGame, totalCoins, adClicked);
            updateUserData({ coins: newTotalCoins });
        } catch (error) {
            console.error("Failed to update user data:", error);
            alert((error as Error).message); // Inform user about play limit
        } finally {
            setIsSubmitting(false);
            setCurrentGame(null);
        }
    };

    return (
        <div className="fixed inset-0 bg-primary z-50 flex items-center justify-center">
            {showAdModal ? (
                <AdModal score={score} onClose={handleAdModalClose} />
            ) : isSubmitting ? (
                 <div className="text-center">
                    <h2 className="text-2xl font-bold text-accent mb-4">Saving score...</h2>
                 </div>
            ) : (
                <SelectedGame onGameEnd={handleGameEnd} />
            )}
        </div>
    );
};

export default GameContainer;
