
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    onAuthStateChanged, 
    signOut as firebaseSignOut, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    User as FirebaseUser,
} from 'firebase/auth';
import { 
    getFirestore, 
    doc, 
    getDoc, 
    setDoc,
    runTransaction,
    Timestamp,
    collection,
    addDoc
} from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig';
import { UserData, GameType } from '../types';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

export const signUpWithEmail = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithEmail = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
};

export const signOut = () => {
    return firebaseSignOut(auth);
};

export const getUserData = async (uid: string): Promise<UserData | null> => {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        return userDoc.data() as UserData;
    }
    return null;
};

export const createUserData = async (user: FirebaseUser): Promise<UserData> => {
    const userData: UserData = {
        uid: user.uid,
        email: user.email,
        coins: 0,
        playCounts: {
            COIN_CLICKER: 0,
            CATCH_GAME: 0,
            REACTION_GAME: 0,
        },
        lastPlayed: {
            COIN_CLICKER: new Date(0).toISOString().split('T')[0],
            CATCH_GAME: new Date(0).toISOString().split('T')[0],
            REACTION_GAME: new Date(0).toISOString().split('T')[0],
        }
    };
    await setDoc(doc(db, 'users', user.uid), userData);
    return userData;
};

export const updateUserCoinsAndPlays = async (
    uid: string,
    game: GameType,
    coinsEarned: number,
    adClicked: boolean
): Promise<number> => {
    const userDocRef = doc(db, 'users', uid);
    let newCoinTotal = 0;
    
    await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userDocRef);
        if (!userDoc.exists()) {
            throw "Document does not exist!";
        }

        const today = new Date().toISOString().split('T')[0];
        const userData = userDoc.data() as UserData;

        const lastPlayedDate = userData.lastPlayed[game];
        let currentPlayCount = userData.playCounts[game];

        if (lastPlayedDate !== today) {
            currentPlayCount = 0;
        }
        
        if (currentPlayCount >= 10) {
            throw new Error("Daily play limit reached for this game.");
        }

        newCoinTotal = userData.coins + coinsEarned;
        
        transaction.update(userDocRef, {
            coins: newCoinTotal,
            [`playCounts.${game}`]: currentPlayCount + 1,
            [`lastPlayed.${game}`]: today,
        });

        // Log game history
        const historyRef = collection(db, "gameHistory");
        await addDoc(historyRef, {
            userId: uid,
            game: game,
            coinsEarned: coinsEarned,
            adClicked: adClicked,
            timestamp: Timestamp.now(),
        });
    });
    
    return newCoinTotal;
};
