import { db, auth } from "../firebase";
import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";

export const useGetUserInfo = (uid = auth.currentUser?.uid) => {
  const [userInfo] = useDocumentData(doc(db, "users", `${uid}`));
  return { userInfo };
};
