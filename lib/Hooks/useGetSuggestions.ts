import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collectionGroup,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

// interface suggestionType {
//   title: string;
//   description: string;
//   category: string;
//   commentCount: number;
//   upvotes: number;
//   createdAt: Timestamp;
//   updatedAt: Timestamp;
//   slug: string;
//   status: string;
//   uid: string;
// }

export const useGetSuggestions = (
  categoryFilter: string,
  orderFilter: string
) => {
  // const [order, setOrder] = useState(orderBy("upvotes", "desc"));
  // const [suggestions, setSuggestions] = useState<suggestionType[]>([]);

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

  //   let unsubscribe;

  //   unsubscribe = onSnapshot(
  //     query(collectionGroup(db, "suggestions"), order),
  //     (querySnapshot) => {
  //       let temp: suggestionType[] = [];
  //       querySnapshot.forEach((doc) => {
  //         temp.push(doc.data() as suggestionType);
  //       });
  //       setSuggestions(temp);
  //     }
  //   );

  //   // turn off realtime subscription
  //   return unsubscribe;
  // }, [orderFilter]);

  const q = query(
    collectionGroup(db, "suggestions"),
    orderBy("upvotes", "desc")
  );

  const [suggestionsObj] = useCollectionData(q);

  const [suggestions, setSuggestions] = useState(suggestionsObj);

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

  return { suggestions };
};
