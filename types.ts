
import { User as FirebaseUser } from 'firebase/auth';

export type GameType = 'COIN_CLICKER' | 'CATCH_GAME' | 'REACTION_GAME';

export interface UserData {
    uid: string;
    email: string | null;
    coins: number;
    playCounts: {
        [key in GameType]: number;
    };
    lastPlayed: {
        [key in GameType]: string; // ISO date string
    };
}

export interface Game {
    id: GameType;
    name: string;
    description: string;
}

export type Language = 'en' | 'bn';
