import { db } from "../firebase";
import { collectionGroup, query, orderBy, limit } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

export const useGetSuggestions = () => {
  const q = query(
    collectionGroup(db, "posts"),
    orderBy("createdAt"),
    limit(10)
  );
  const [suggestions, loading, error] = useCollectionData(q);
  return { suggestions, loading, error };
};
