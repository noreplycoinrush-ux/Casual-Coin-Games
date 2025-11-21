
import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import Header from '../layout/Header';
import GameCard from './GameCard';
import { Game, GameType } from '../../types';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';

const games: Game[] = [
    { id: 'COIN_CLICKER', name: 'Coin Clicker', description: 'Click the falling coins as fast as you can.' },
    { id: 'CATCH_GAME', name: 'Item Catcher', description: 'Catch the good items, avoid the bad ones.' },
    { id: 'REACTION_GAME', name: 'Reaction Test', description: 'Tap when the bar hits the green zone.' },
];

const Dashboard: React.FC = () => {
    const { userData, t } = useAppContext();
    const [showRedeemModal, setShowRedeemModal] = useState(false);

    const formatCoinsToRupees = (coins: number) => {
        const rupees = (coins / 100) * 0.10;
        return `₹${rupees.toFixed(2)}`;
    };

    if (!userData) {
        return <div className="flex items-center justify-center min-h-screen"><Spinner /></div>;
    }

    const canRedeem = userData.coins >= 5000;

    return (
        <div className="min-h-screen bg-primary">
            <Header />
            <main className="p-4 sm:p-8 max-w-7xl mx-auto">
                <section className="bg-secondary p-6 rounded-lg shadow-md mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-light-text">{userData.email}</h2>
                        <div className="flex items-center gap-2 mt-2">
                             <p className="text-3xl font-bold text-accent">{userData.coins.toLocaleString()} {t('coins')}</p>
                             <p className="text-xl text-dark-text">({formatCoinsToRupees(userData.coins)})</p>
                        </div>
                    </div>
                    <div>
                        <Button onClick={() => setShowRedeemModal(true)} disabled={!canRedeem}>{t('redeem')}</Button>
                        {!canRedeem && <p className="text-sm text-dark-text mt-1 text-center sm:text-right">{t('redeemPrompt')}</p>}
                    </div>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-light-text mb-6">{t('gameSelection')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {games.map(game => (
                            <GameCard key={game.id} game={game} userData={userData} />
                        ))}
                    </div>
                </section>
            </main>
            
            {showRedeemModal && (
                 <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-secondary rounded-lg p-8 max-w-sm w-full text-center">
                        <h3 className="text-2xl font-bold text-accent mb-4">{t('redeemSuccessTitle')}</h3>
                        <p className="text-light-text mb-6">{t('redeemSuccessMessage')}</p>
                        <Button onClick={() => setShowRedeemModal(false)}>{t('ok')}</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
