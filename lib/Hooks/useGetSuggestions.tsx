import { useEffect } from "react";
import { db } from "../firebase";
import { collectionGroup, query, orderBy, limit } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

export const useGetSuggestions = (currentFilter: string) => {
  // orderBy comments.length or upvotes
  // filter for tags

  const q = query(collectionGroup(db, "suggestions"));
  const [suggestions, loading, error] = useCollectionData(q);

  // useEffect(() => {

  // }, [currentFilter])

  // if (currentFilter == "All") {
  //   suggestions = suggestionsObject;
  // } else {
  //   const suggestions = suggestionsObject?.filter(
  //     (suggestion) => suggestion.category == currentFilter
  //   );
  // }

  return { suggestions, loading, error };
};
