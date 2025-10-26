import {useEffect, useState} from 'react';
import {
  FirebaseAuthTypes,
  onAuthStateChanged,
} from '@react-native-firebase/auth';

import {firebaseAuth} from '../lib/firebase';

interface AuthBootstrapState {
  initializing: boolean;
  user: FirebaseAuthTypes.User | null;
}

export function useAuthBootstrap(): AuthBootstrapState {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;
    const unsubscribe = onAuthStateChanged(firebaseAuth, currentUser => {
      if (!mounted) {
        return;
      }
      setUser(currentUser);
      setTimeout(() => {
        if (mounted) {
          setInitializing(false);
        }
      }, 650);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return {user, initializing};
}
