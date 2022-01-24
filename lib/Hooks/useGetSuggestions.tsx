import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collectionGroup, query, orderBy, limit } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

export const useGetSuggestions = (categoryFilter: string) => {
  // const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);

  // useEffect(() => {
  //   if (currentFilter === "All") {
  //     setFilteredSuggestions(suggestions);
  //   } else {
  //     setFilteredSuggestions(
  //       suggestions?.filter(
  //         (suggestion) => suggestion.category === currentFilter.toLowerCase()
  //       )
  //     );
  //   }
  // }, [currentFilter]);

  // console.log(loading, suggestions);

  // const filterSuggestions = (arrayOfInvoices) => {
  //   const filter = categoryFilter.toLowerCase();
  //   return arrayOfInvoices
  //     ? arrayOfInvoices.filter(
  //         (suggestion) =>
  //           (suggestion.category === "ui" && filter) ||
  //           (suggestion.category === "pending" && filter) ||
  //           (suggestion.category === "paid" && filter)
  //       )
  //     : null;
  // };

  // const filteredInvoices = filterInvoices(filters, invoices);

  const [suggestions, loading, error] = useCollectionData(
    collectionGroup(db, "suggestions")
  );

  return { suggestions, loading, error };
};
