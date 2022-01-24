import { db } from "../firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

export const useGetComments = (
  uid: string | string[] | undefined,
  slug: string | string[] | undefined
) => {
  // fetch comments nested below the user that made the suggestion
  const commentsRef = collection(
    db,
    "users",
    `${uid}`,
    "suggestions",
    `${slug}`,
    "comments"
  );
  const [comments] = useCollectionData(
    query(commentsRef, orderBy("createdAt"))
  );

  return { comments };
};
