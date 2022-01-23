import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export const useGetUser = () => {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      unsubscribe = onSnapshot(doc(db, "users", `${user?.uid}`), (doc) => {
        setUsername(doc.data()?.username);
      });
    } else {
      setUsername(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, username };
};
