
import React from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import AuthScreen from './components/auth/AuthScreen';
import Dashboard from './components/dashboard/Dashboard';
import GameContainer from './components/game/GameContainer';
import { Spinner } from './components/ui/Spinner';

const AppContent: React.FC = () => {
    const { user, loading, currentGame } = useAppContext();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-primary">
                <Spinner />
            </div>
        );
    }

    if (!user) {
        return <AuthScreen />;
    }

    if (currentGame) {
        return <GameContainer />;
    }

    return <Dashboard />;
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <div className="min-h-screen bg-primary">
                <AppContent />
            </div>
        </AppProvider>
    );
};

export default App;
