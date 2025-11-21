
import React from 'react';
import { Button } from '../ui/Button';
import { useAppContext } from '../../contexts/AppContext';

interface AdModalProps {
    score: number;
    onClose: (adClicked: boolean) => void;
}

const AdModal: React.FC<AdModalProps> = ({ score, onClose }) => {
    const { t } = useAppContext();
    const baseReward = 100;

    return (
        <div className="bg-secondary p-8 rounded-lg shadow-2xl text-center max-w-md w-full mx-4">
            <h2 className="text-4xl font-bold text-accent mb-2">{t('gameOver')}</h2>
            <p className="text-xl text-light-text mb-6">
                {t('yourScore')} <span className="font-bold text-accent">{score + baseReward}</span> {t('coins')}
            </p>

            <div className="bg-primary p-6 rounded-lg border-2 border-dashed border-accent mb-6 animate-pulse">
                <p className="text-lg font-semibold text-light-text">
                    {t('adPrompt')}
                </p>
                <p className="text-sm text-dark-text mt-1">
                    (mock ad)
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => onClose(true)} className="w-full sm:w-auto">
                    {t('getBonus')}
                </Button>
                <Button onClick={() => onClose(false)} variant="secondary" className="w-full sm:w-auto">
                    {t('noThanks')}
                </Button>
            </div>
        </div>
    );
};

export default AdModal;
