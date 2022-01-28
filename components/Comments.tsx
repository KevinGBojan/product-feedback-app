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
import { useRouter } from "next/router";

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
  userPostUid: string | string[] | undefined;
}

const Comments = (props: commentsType) => {
  const router = useRouter();
  const { user, username } = useContext(UserContext); // fetch user so we can add uid to any comment he or she makes
  const [openForm, setOpenForm] = useState(false); // response modal
  const [formValue, setFormValue] = useState("");
  const { replies } = useGetReplies(props.uid, props.slug, props.commentUid); // fetch replies

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await addDoc(
      collection(
        db,
        "users",
        `${props.userPostUid}`,
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
      doc(db, "users", `${props.userPostUid}`, "suggestions", `${props.slug}`),
      {
        commentCount: increment(1),
      }
    );
  };

  return (
    <div className="border-b-2 py-8">
      <Comment
        key={props.commentUid}
        createdAt={props.createdAt}
        uid={props.uid}
        comment={props.comment}
      />
      {!openForm && (
        <span
          className="text-pallet-300 cursor-pointer text-xs"
          onClick={() => setOpenForm(!openForm)}
        >
          Reply
        </span>
      )}

      {openForm && (
        <form onSubmit={(e) => onSubmit(e)} className="mt-6">
          <textarea
            className="bg-pallet-500 text-pallet-600 min-h-[100px] w-full rounded-md py-5 px-4 font-light outline-none"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
          />
          {username ? (
            <>
              <div className="mt-6 mb-2 flex justify-between">
                <span className="text-pallet-700 font-light">
                  {250 - formValue.length} Characters Left
                </span>
                <div>
                  <button
                    type="button"
                    onClick={() => setOpenForm(!openForm)}
                    className="text-pallet-500 bg-pallet-600 mr-4 rounded-lg px-6 py-4 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formValue.length < 4 || formValue.length > 250}
                    className="text-pallet-500 bg-pallet-100 rounded-lg px-8 py-4 text-xs font-bold"
                  >
                    Post Reply
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mt-6 mb-2 flex justify-between">
                <span className="text-pallet-700 font-light">
                  Login to comment
                </span>

                <button
                  type="button"
                  onClick={() => router.push("/enter")}
                  className="text-pallet-500 bg-pallet-100 rounded-lg px-8 py-4 text-xs font-bold"
                >
                  Login
                </button>
              </div>
            </>
          )}
        </form>
      )}
      <div className="mt-6 border-l-2 pl-6">
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
