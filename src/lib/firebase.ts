import {getApp} from '@react-native-firebase/app';
import {getAuth} from '@react-native-firebase/auth';
import {getFirestore} from '@react-native-firebase/firestore';

const firebaseApp = getApp();
const firebaseAuth = getAuth(firebaseApp);
const firebaseFirestore = getFirestore(firebaseApp);

export {firebaseApp, firebaseAuth, firebaseFirestore};
