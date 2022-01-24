import { useGetUserSuggestion } from "../../../lib/Hooks/useGetUserSuggestion";
import { useGetUserWithUsername } from "../../../lib/Hooks/useGetUserWithUsername";
import { useRouter } from "next/router";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import Suggestion from "../../../components/Suggestion";
import { db } from "../../../lib/firebase";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import React, { useState, useContext } from "react";
import { UserContext } from "../../../lib/context";
import Comment from "../../../components/Comment";

export default function Comments({}) {
  const { user } = useContext(UserContext); // get current user data
  const { query } = useRouter(); // fetch username and suggestion slug from URL
  const { userId } = useGetUserWithUsername(query.username); // get user UID with username
  const { suggestion } = useGetUserSuggestion(userId?.uid, query.slug); // fetch suggestion

  const [formValue, setFormValue] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateDoc(
      doc(db, "users", `${userId?.uid}`, "suggestions", `${query.slug}`),
      {
        comments: [
          ...suggestion?.comments,
          {
            uid: user?.uid,
            comment: formValue,
            replies: {},
            createdAt: Timestamp.fromDate(new Date()),
          },
        ],
      }
    ).then(() => setFormValue(""));
  };

  return (
    <main className="mt-10 w-1/3 mx-auto flex flex-col justify-center items-left">
      <Link href="/">
        <div className="text-pallet-700 font-bold flex cursor-pointer">
          <IoIosArrowBack size="24" className="text-pallet-200 mr-2" />
          <span>Go Back</span>
        </div>
      </Link>
      <Suggestion
        slug={suggestion?.slug}
        uid={suggestion?.uid}
        category={suggestion?.category}
        title={suggestion?.title}
        commentsLength={suggestion?.comments.length}
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
        </form>
      </div>
      <div className="bg-white mt-8 px-8 rounded-lg pb-20 pt-8 mb-40">
        <span className="text-pallet-600 font-bold text-lg">
          {suggestion?.comments.length} Comment(s)
        </span>
        {suggestion?.comments.reverse().map((comment: any) => (
          <Comment
            key={comment.comment}
            comment={comment.comment}
            createdAt={comment.createdAt}
            replies={comment.replies}
            uid={comment.uid}
          />
        ))}
      </div>
    </main>
  );
}
