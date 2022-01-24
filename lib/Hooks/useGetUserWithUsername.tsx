import { db } from "../firebase";
import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";

export const useGetUserWithUsername = (
  username: string | string[] | undefined
) => {
  // get user id using username
  const [userId] = useDocumentData(doc(db, "usernames", `${username}`));
  return { userId };
};
