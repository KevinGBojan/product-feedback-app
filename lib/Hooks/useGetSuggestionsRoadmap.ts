import { db } from "../firebase";
import { collectionGroup, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

export const useGetSuggestionsRoadmap = () => {
  const q = query(
    collectionGroup(db, "suggestions"),
    where("status", "!=", "suggestion")
  );

  // const suggestions = getDocs(q).then((docs) => console.log(docs));

  const [suggestions, loading, error] = useCollectionData(q);

  return { suggestions };
};
