import React, { useState } from "react";
import { useGetUserInfo } from "../lib/Hooks/useGetUserInfo";
import { IoIosArrowUp } from "react-icons/io";
import { FaComment } from "react-icons/fa";
import Image from "next/image";
import { db } from "../lib/firebase";
import { doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import toast from "react-hot-toast";
import Link from "next/link";

interface commentType {
  slug: string;
  uid: string;
  createdAt: any;
  comment: string;
  replies: [{}];
}
const Comment = (props: commentType) => {
  const { user } = useContext(UserContext);
  const { userInfo } = useGetUserInfo(props.uid);

  const [openForm, setOpenForm] = useState(false);

  const [formValue, setFormValue] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateDoc(
      doc(db, "users", `${props.uid}`, "suggestions", `${props.slug}`),
      {
        // comments: [
        //   ...suggestion?.comments,
        //   {
        //     uid: user?.uid,
        //     comment: formValue,
        //     replies: {},
        //     createdAt: Timestamp.fromDate(new Date()),
        //   },
        // ],
      }
    ).then(() => setFormValue(""));
  };

  let date = props.createdAt?.toDate();
  return (
    <div className="py-8 border-b-2">
      {userInfo && (
        <div className="flex">
          <Image
            src={userInfo?.avatarURL}
            height="35"
            width="35"
            className="rounded-full"
          />
          <div className="flex justify-center ml-4">
            <div className="flex flex-col mr-3">
              <span className="text-pallet-600 font-bold text-xs">
                {userInfo.displayName}
              </span>
              <span className="text-pallet-700 font-light text-xs">
                @{userInfo.username}
              </span>
            </div>
            <span className="text-[#647196] font-light text-xs">
              {new Intl.DateTimeFormat("en-GB", {
                month: "short",
                day: "2-digit",
                hour: "numeric",
                minute: "numeric",
              }).format(date)}
            </span>
          </div>
        </div>
      )}
      <div className="mt-4 text-sm text-pallet-700 font-light">
        {props.comment}
      </div>
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
            className="w-full min-h-[150px] bg-pallet-500 outline-none rounded-md py-5 px-4 text-pallet-600 font-light"
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
    </div>
  );
};

export default Comment;
