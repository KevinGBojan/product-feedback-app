import { db } from "../firebase";
import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";

export const useGetUserSuggestion = (uid: string, slug: string) => {
  const [suggestion] = useDocumentData(
    doc(db, "users", `${uid}`, "suggestions", `${slug}`)
  );
  return { suggestion };
};
