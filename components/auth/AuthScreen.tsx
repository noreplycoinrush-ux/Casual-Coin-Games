
import React, { useState } from 'react';
import { signUpWithEmail, signInWithEmail, signInWithGoogle } from '../../services/firebaseService';
import { Button } from '../ui/Button';
import { GoogleIcon } from '../ui/icons';
import { useAppContext } from '../../contexts/AppContext';

const AuthScreen: React.FC = () => {
    const { t } = useAppContext();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAuthAction = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isLogin) {
                await signInWithEmail(email, password);
            } else {
                await signUpWithEmail(email, password);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            await signInWithGoogle();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary p-4">
            <div className="w-full max-w-md bg-secondary p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center text-accent mb-2">{t('appName')}</h1>
                <p className="text-center text-dark-text mb-6">{t('loginPrompt')}</p>
                
                {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4 text-center">{error}</p>}
                
                <form onSubmit={handleAuthAction}>
                    <div className="mb-4">
                        <label className="block text-dark-text mb-2" htmlFor="email">{t('email')}</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 bg-primary border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-dark-text mb-2" htmlFor="password">{t('password')}</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-primary border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? '...' : isLogin ? t('signIn') : t('signUp')}
                    </Button>
                </form>

                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-gray-600"></div>
                    <span className="flex-shrink mx-4 text-dark-text">{t('orSignInWith')}</span>
                    <div className="flex-grow border-t border-gray-600"></div>
                </div>

                <Button variant="secondary" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
                    <GoogleIcon className="w-6 h-6" /> Google
                </Button>

                <p className="mt-6 text-center text-dark-text">
                    {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}{' '}
                    <button onClick={() => setIsLogin(!isLogin)} className="text-accent hover:underline">
                        {isLogin ? t('signUp') : t('signIn')}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthScreen;
