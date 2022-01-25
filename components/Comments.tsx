import { useState } from "react";
import Comment from "./Comment";

// Firebase
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  Timestamp,
  updateDoc,
  doc,
  increment,
} from "firebase/firestore";
import { useGetReplies } from "../lib/Hooks/useGetReplies";

// Auth
import { useContext } from "react";
import { UserContext } from "../lib/context";

// Notifications
import toast from "react-hot-toast";

// This component renders out an individual comment and all associated replies
// It takes the uid of the user who made it, the suggestion slug, & uid of the
// comment so it can fetch the replies.
// It also takes the comment and createdAt to render out the individual comment.

interface commentsType {
  slug: string | string[] | undefined;
  uid: string;
  createdAt: any;
  comment: string;
  commentUid: string;
}

const Comments = (props: commentsType) => {
  const { user } = useContext(UserContext); // fetch user so we can add uid to any comment he or she makes
  const [openForm, setOpenForm] = useState(false); // response modal
  const [formValue, setFormValue] = useState("");
  const { replies } = useGetReplies(props.uid, props.slug, props.commentUid); // fetch replies

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await addDoc(
      collection(
        db,
        "users",
        `${props.uid}`,
        "suggestions",
        `${props.slug}`,
        "comments",
        `${props.commentUid}`,
        "replies"
      ),
      {
        uid: `${user?.uid}`,
        comment: formValue,
        createdAt: Timestamp.fromDate(new Date()),
      }
    )
      .then(() => setFormValue(""))
      .then(() => setOpenForm(false))
      .then(() => toast.success("Comment added successfully"));

    await updateDoc(
      doc(db, "users", `${props.uid}`, "suggestions", `${props.slug}`),
      {
        commentCount: increment(1),
      }
    );
  };

  return (
    <div className="py-8 border-b-2">
      <Comment
        key={props.commentUid}
        createdAt={props.createdAt}
        uid={props.uid}
        comment={props.comment}
      />
      {!openForm && (
        <span
          className="text-pallet-300 text-xs cursor-pointer"
          onClick={() => setOpenForm(!openForm)}
        >
          Reply
        </span>
      )}

      {openForm && (
        <form onSubmit={(e) => onSubmit(e)} className="mt-6">
          <textarea
            className="w-full min-h-[100px] bg-pallet-500 outline-none rounded-md py-5 px-4 text-pallet-600 font-light"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
          />
          <div className="flex justify-between mt-6 mb-2">
            <span className="font-light text-pallet-700">
              {250 - formValue.length} Characters Left
            </span>
            <div>
              <button
                type="button"
                onClick={() => setOpenForm(!openForm)}
                className="text-pallet-500 text-xs font-bold bg-pallet-600 px-6 py-4 rounded-lg mr-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formValue.length < 4 || formValue.length > 250}
                className="text-pallet-500 bg-pallet-100 text-xs font-bold px-8 py-4 rounded-lg"
              >
                Post Reply
              </button>
            </div>
          </div>
        </form>
      )}
      <div className="border-l-2 pl-6 mt-6">
        {replies?.map((res) => (
          <Comment
            key={res.comment}
            createdAt={res.createdAt}
            uid={res.uid}
            comment={res.comment}
          />
        ))}
      </div>
    </div>
  );
};

export default Comments;
