
import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { CoinIcon, LanguageIcon } from '../ui/icons';
import { Button } from '../ui/Button';

const Header: React.FC = () => {
    const { userData, signOut, language, setLanguage, t } = useAppContext();

    const formatCoins = (coins: number) => {
        const rupees = (coins / 100) * 0.10;
        return `₹${rupees.toFixed(2)}`;
    };

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'bn' : 'en');
    };

    return (
        <header className="bg-secondary p-4 shadow-lg flex justify-between items-center">
            <h1 className="text-xl font-bold text-accent">{t('appName')}</h1>
            <div className="flex items-center gap-4">
                {userData && (
                    <div className="hidden sm:flex items-center gap-2 bg-primary px-3 py-1 rounded-full">
                        <CoinIcon className="w-6 h-6 text-accent" />
                        <span className="font-semibold text-light-text">{userData.coins}</span>
                        <span className="text-dark-text">({formatCoins(userData.coins)})</span>
                    </div>
                )}
                 <button onClick={toggleLanguage} className="p-2 rounded-full hover:bg-primary transition-colors">
                    <LanguageIcon className="w-6 h-6 text-light-text" />
                </button>
                <Button variant="ghost" onClick={signOut}>{t('signOut')}</Button>
            </div>
        </header>
    );
};

export default Header;
