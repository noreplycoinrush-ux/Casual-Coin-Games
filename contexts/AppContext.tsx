
import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { onAuthChange, getUserData, createUserData, signOut as firebaseSignOut } from '../services/firebaseService';
import { UserData, GameType, Language } from '../types';
import { translations } from '../i18n/locales';

interface AppContextType {
    user: FirebaseUser | null;
    userData: UserData | null;
    loading: boolean;
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof typeof translations.en) => string;
    updateUserData: (data: Partial<UserData>) => void;
    signOut: () => void;
    currentGame: GameType | null;
    setCurrentGame: (game: GameType | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState<Language>('en');
    const [currentGame, setCurrentGame] = useState<GameType | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthChange(async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                let data = await getUserData(firebaseUser.uid);
                if (!data) {
                    data = await createUserData(firebaseUser);
                }
                setUserData(data);
            } else {
                setUser(null);
                setUserData(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const updateUserData = (data: Partial<UserData>) => {
        setUserData(prev => prev ? { ...prev, ...data } : null);
    };
    
    const signOut = async () => {
        await firebaseSignOut();
        setUser(null);
        setUserData(null);
        setCurrentGame(null);
    };

    const t = useCallback((key: keyof typeof translations.en): string => {
        return translations[language][key] || translations.en[key];
    }, [language]);

    return (
        <AppContext.Provider value={{ 
            user, 
            userData, 
            loading, 
            language, 
            setLanguage, 
            t,
            updateUserData,
            signOut,
            currentGame,
            setCurrentGame
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
