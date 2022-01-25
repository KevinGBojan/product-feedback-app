import { useState, useContext } from "react";

// Components
import Suggestion from "../../../components/Suggestion";
import Comments from "../../../components/Comments";

// Firebase
import { useGetUserSuggestion } from "../../../lib/Hooks/useGetUserSuggestion";
import { useGetUserWithUsername } from "../../../lib/Hooks/useGetUserWithUsername";
import { useGetComments } from "../../../lib/Hooks/useGetComments";
import { db } from "../../../lib/firebase";
import {
  collection,
  addDoc,
  Timestamp,
  updateDoc,
  doc,
  increment,
  setDoc,
} from "firebase/firestore";

// Auth
import { UserContext } from "../../../lib/context";

// Routing
import { useRouter } from "next/router";
import Link from "next/link";

// Icons
import { IoIosArrowBack } from "react-icons/io";

// Other
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

export default function CommentsSection({}) {
  const { user, username } = useContext(UserContext); // get current user data
  const router = useRouter(); // fetch username and suggestion slug from URL
  const { userId } = useGetUserWithUsername(router.query.username); // get user UID with username
  const { suggestion } = useGetUserSuggestion(userId?.uid, router.query.slug); // fetch suggestion
  const { comments } = useGetComments(userId?.uid, router.query.slug); // query comments suggestion

  const [formValue, setFormValue] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const randomId = uuidv4();

    await setDoc(
      doc(
        db,
        "users",
        `${userId?.uid}`,
        "suggestions",
        `${router.query.slug}`,
        "comments",
        `${randomId}`
      ),
      {
        commentUid: randomId,
        uid: user?.uid,
        comment: formValue,
        createdAt: Timestamp.fromDate(new Date()),
      }
    )
      .then(() => setFormValue(""))
      .then(() => toast.success("Comment added successfully"));

    console.log(`${userId?.uid}`, `${router.query.slug}`);

    await updateDoc(
      doc(db, "users", `${userId?.uid}`, "suggestions", `${router.query.slug}`),
      {
        commentCount: increment(1),
      }
    );
  };

  return (
    <main className="mt-10 w-1/2 mx-auto flex flex-col justify-center items-left">
      <div className="flex justify-between">
        <div
          className="text-pallet-700 font-bold flex cursor-pointer"
          onClick={() => router.back()}
        >
          <IoIosArrowBack size="24" className="text-pallet-200 mr-2" />
          <span>Go Back</span>
        </div>
        {username == router.query.username && (
          <Link href={`/${router.query.username}/${router.query.slug}/edit`}>
            <div className="cursor-pointer bg-pallet-200 text-pallet-500 font-bold text-sm px-5 py-3 rounded-lg">
              Edit Feedback
            </div>
          </Link>
        )}
      </div>

      <Suggestion
        slug={suggestion?.slug}
        uid={suggestion?.uid}
        commentCount={suggestion?.commentCount}
        category={suggestion?.category}
        title={suggestion?.title}
        description={suggestion?.description}
        createdAt={suggestion?.createdAt}
        upvotes={suggestion?.upvotes}
      />
      <div className="bg-white mt-8 p-8 rounded-lg">
        <span className="text-pallet-600 font-bold text-lg">Add Comment</span>
        <form onSubmit={(e) => onSubmit(e)} className="mt-6">
          <textarea
            className="w-full min-h-[150px] bg-pallet-500 outline-none rounded-md py-5 px-4 text-pallet-600 font-light"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
          />
          {username ? (
            <>
              <div className="flex justify-between mt-6 mb-2">
                <span className="font-light text-pallet-700">
                  {250 - formValue.length} Characters Left
                </span>
                <button
                  type="submit"
                  disabled={formValue.length < 4 || formValue.length > 250}
                  className="text-pallet-500 bg-pallet-100 text-xs font-bold px-8 py-4 rounded-lg"
                >
                  Post Comment
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between mt-6 mb-2">
                <span className="font-light text-pallet-700">
                  Login to comment
                </span>
                <button
                  type="button"
                  onClick={() => router.push("/enter")}
                  className="text-pallet-500 bg-pallet-100 text-xs font-bold px-8 py-4 rounded-lg"
                >
                  Login
                </button>
              </div>
            </>
          )}
        </form>
      </div>
      <div className="bg-white mt-8 px-8 rounded-lg pb-20 pt-8 mb-40">
        <span className="text-pallet-600 font-bold text-lg">
          {comments?.length} Comment(s)
        </span>
        {comments?.reverse().map((comment) => (
          <Comments
            slug={router.query.slug}
            key={comment.commentUid}
            commentUid={comment.commentUid}
            comment={comment.comment}
            createdAt={comment.createdAt}
            uid={comment.uid}
          />
        ))}
      </div>
    </main>
  );
}
