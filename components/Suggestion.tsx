import React from "react";
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

interface suggestionType {
  slug: string;
  uid: string;
  createdAt: any;
  title: string;
  description: string;
  upvotes: number;
  commentsLength: number;
  category: string;
}

const Suggestion = (props: suggestionType) => {
  const { user } = useContext(UserContext);

  const { userInfo } = useGetUserInfo(props.uid);

  let date = props?.createdAt.toDate();

  const handleUpvote = async () => {
    const upvoteRef = doc(
      db,
      "users",
      `${user?.uid}`,
      "suggestions",
      `${props.slug}`,
      "upvotes",
      `${user?.uid}`
    );
    const docSnap = await getDoc(upvoteRef);
    if (docSnap.exists()) {
      toast.error("You can only upvote a request once!");
    } else {
      await updateDoc(
        doc(db, "users", `${props.uid}`, "suggestions", `${props.slug}`),
        {
          upvotes: increment(1),
        }
      );
      await setDoc(upvoteRef, { uid: `${user?.uid}` }).then(() =>
        toast.success("Request upvoted successfully!")
      );
    }
  };

  return (
    <div className="bg-white px-8 py-8 flex mt-8 rounded-lg">
      <div
        className="bg-pallet-400 h-[50px] flex flex-col items-center px-2 rounded-xl mr-8 cursor-pointer"
        onClick={handleUpvote}
      >
        <IoIosArrowUp size="24" className="text-pallet-200" />
        <span className="font-bold text-pallet-600">{props.upvotes}</span>
      </div>
      <Link href={`/${userInfo?.username}/${props.slug}`}>
        <div className="w-full flex flex-col cursor-pointer">
          {userInfo && (
            <div className="flex">
              <Image
                src={userInfo?.avatarURL}
                height="35"
                width="35"
                className="rounded-full"
              />
              <div className="flex flex-col ml-4">
                <span className="text-pallet-600 font-bold text-sm">
                  {userInfo.displayName}
                </span>
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
          <div className="flex justify-between mt-4">
            <div className="flex flex-col">
              <span className="text-pallet-600 font-bold">{props.title}</span>
              <span className="text-pallet-700 font-light text-sm">
                {props.description}
              </span>
              <div className="bg-pallet-400 flex items-center justify-center w-[100px] rounded-lg py-1 mt-3 capitalize px-2 text-pallet-300">
                {props.category}
              </div>
            </div>
            <div className="flex">
              <FaComment size="24" className="text-[#CDD2EE] mr-3" />
              <span className="text-pallet-600 font-bold">
                {props.commentsLength}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Suggestion;
