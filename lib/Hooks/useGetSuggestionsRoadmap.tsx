import { db } from "../firebase";
import { collectionGroup, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

export const useGetSuggestionsRoadmap = () => {
  const [suggestions, loading, error] = useCollectionData(
    query(
      collectionGroup(db, "suggestions"),
      where("status", "!=", "suggestion")
    )
  );

  return { suggestions, loading, error };
};
