import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  getDocs,
  collectionGroup,
  query,
  orderBy,
  limit,
  getDoc,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

export const useGetSuggestions = (
  categoryFilter: string,
  orderFilter: string
) => {
  const [order, setOrder] = useState(orderBy("upvotes"));

  // useEffect(() => {
  //   switch (orderFilter) {
  //     case "Most Upvotes":
  //       setOrder(orderBy("upvotes", "desc"));
  //     case "Least Upvotes":
  //       setOrder(orderBy("upvotes", "asc"));
  //     case "Most Comments":
  //       setOrder(orderBy("commentCount", "desc"));
  //     case "Least Comments":
  //       setOrder(orderBy("commentCount", "asc"));
  //   }
  // }, [orderFilter]);

  const collectionRef = collectionGroup(db, "suggestions");
  const q = query(collectionRef, order);

  // const suggestions = getDocs(q).then((doc) => console.log(doc));

  const [suggestionsObj] = useCollectionData(q);

  const [suggestions, setSuggestions] = useState(suggestionsObj);

  useEffect(() => {
    if (categoryFilter === "All") {
      console.log(suggestionsObj);
      setSuggestions(suggestionsObj);
    } else {
      setSuggestions(
        suggestionsObj?.filter(
          (suggestion) => suggestion.category === categoryFilter.toLowerCase()
        )
      );
    }
  }, [categoryFilter, suggestionsObj]);

  return { suggestions };
};
