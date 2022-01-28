import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collectionGroup } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

export const useGetSuggestions = (
  categoryFilter: string,
  orderFilter: string
) => {
  const [suggestionsObj, loading, error] = useCollectionData(
    collectionGroup(db, "suggestions")
  );

  const [suggestions, setSuggestions] = useState(suggestionsObj);

  useEffect(() => {
    switch (orderFilter) {
      case "Most Upvotes":
        setSuggestions(suggestionsObj?.sort((a, b) => b.upvotes - a.upvotes));
        break;
      case "Least Upvotes":
        setSuggestions(suggestionsObj?.sort((a, b) => a.upvotes - b.upvotes));
        break;
      case "Most Comments":
        setSuggestions(
          suggestionsObj?.sort((a, b) => b.commentCount - a.commentCount)
        );
        break;
      case "Least Comments":
        setSuggestions(
          suggestionsObj?.sort((a, b) => a.commentCount - b.commentCount)
        );
        break;
    }
  }, [orderFilter, suggestionsObj]);

  useEffect(() => {
    if (categoryFilter === "All") {
      setSuggestions(suggestionsObj);
    } else {
      setSuggestions(
        suggestionsObj?.filter(
          (suggestion) => suggestion.category === categoryFilter.toLowerCase()
        )
      );
    }
  }, [categoryFilter, suggestionsObj]);

  return { suggestions, loading, error };
};
