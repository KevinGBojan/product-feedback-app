import { db } from "../firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

export const useGetReplies = (
  uid: string | string[] | undefined,
  slug: string | string[] | undefined,
  commentUid: string
) => {
  // fetch replies nested below a specific comment
  const repliesRef = collection(
    db,
    "users",
    `${uid}`,
    "suggestions",
    `${slug}`,
    "comments",
    `${commentUid}`,
    "replies"
  );

  const [replies] = useCollectionData(query(repliesRef, orderBy("createdAt")));

  return { replies };
};
