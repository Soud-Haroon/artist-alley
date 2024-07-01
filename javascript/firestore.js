import { firebase } from './firebase-config.js';

import {
    getFirestore,
    doc,
    setDoc,
    getDoc
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

import {
    USER_TYPE_ARTIST,
    USER_TYPE_ORGANISER,
    ARTIST_TABLE,
    ORGANISER_TABLE,
    TABLE_USER_TYPE
} from '../javascript/app-constants.js';

const firestore = getFirestore(firebase);

async function saveUserDataInDb(user) {
    await saveUserTypeInDb(user);
    let table;
    if (user.userType == USER_TYPE_ARTIST) {
        table = ARTIST_TABLE;
    } else if (user.userType == USER_TYPE_ORGANISER) {
        table = ORGANISER_TABLE;
    }
    try {
        if (table) {
            const ref = doc(firestore, table, user.uid);
            await setDoc(ref, user);
            localStorage.setItem('user', JSON.stringify(user));
        }
    } catch (error) {
        console.error(error);
    }
}

async function saveUserTypeInDb(user) {
    try {
        const ref = doc(firestore, TABLE_USER_TYPE, user.uid);
        let userTypeObject = {
            userType: user.userType
        }
        await setDoc(ref, userTypeObject);
    } catch (error) {
        console.error(error);
    }
}

async function getUserDataById(userId, userType) {
    let table;
    if (userType == USER_TYPE_ARTIST) {
        table = ARTIST_TABLE;
    } else if (userType == USER_TYPE_ORGANISER) {
        table = ORGANISER_TABLE;
    }
    try {
        if (table) {
            const userRef = doc(firestore, table, userId);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) { 
                return userDoc.data();
            } else {
                console.log('No such user');
                return null;
            }
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getUserTypeDataById(userId) {
    const userRef = doc(firestore, TABLE_USER_TYPE, userId);
    const userDoc = await getDoc(userRef);
    if(userDoc.exists()) {
        return userDoc.data();
    }
}

export {
    saveUserDataInDb,
    getUserDataById,
    getUserTypeDataById
}