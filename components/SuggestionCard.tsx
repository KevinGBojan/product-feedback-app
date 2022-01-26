import { useGetUserInfo } from "../lib/Hooks/useGetUserInfo";
import { IoIosArrowUp } from "react-icons/io";
import { FaComment } from "react-icons/fa";
import useWindowDimensions from "../lib/Hooks/useWindowDimensions";
import { db } from "../lib/firebase";
import { doc, updateDoc, getDoc, increment, setDoc } from "firebase/firestore";
import Link from "next/link";
// Animation
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import router from "next/router";
import { UserContext } from "../lib/context";
import { useContext } from "react";

interface SuggestionCardProps {
  title: string;
  description: string;
  status: string;
  category: string;
  upvotes: number;
  slug: string;
  uid: string;
  commentCount: number;
}

const SuggestionCard = (props: SuggestionCardProps) => {
  const { user } = useContext(UserContext);
  const { userInfo } = useGetUserInfo(props.uid);
  const { width } = useWindowDimensions();

  const childrenVariants = {
    hidden: {
      opacity: 0,
      y: 100,
    },
    show: {
      opacity: 1,
      y: 0,
    },
  };

  const suggestionRef = doc(
    db,
    "users",
    `${props.uid}`,
    "suggestions",
    `${props.slug}`
  );

  const handleUpvote = async () => {
    const upvoteRef = doc(
      db,
      "users",
      `${props.uid}`,
      "suggestions",
      `${props.slug}`,
      "upvotes",
      `${props.uid}`
    );
    const docSnap = await getDoc(upvoteRef);

    if (!user) {
      {
        toast.error("Please login to upvote suggestions!");
      }
    } else if (docSnap.exists()) {
      toast.error("You can only upvote a request once!");
    } else {
      await updateDoc(
        doc(db, "users", `${props.uid}`, "suggestions", `${props.slug}`),
        {
          upvotes: increment(1),
        }
      );
      await setDoc(upvoteRef, { uid: `${props.uid}` }).then(() =>
        toast.success("Request upvoted successfully!")
      );
    }
  };

  return (
    <motion.div
      drag
      dragSnapToOrigin={true}
      dragElastic={0.8}
      onDragEnd={(e, info) => {
        if (!user) {
          {
            toast.error("Please login to change the status of a suggestion!");
          }
        } else if (info.point.x > 0 && info.point.x < width * 0.39) {
          updateDoc(suggestionRef, {
            status: "planned",
          });
        } else if (info.point.x > width * 0.39 && info.point.x < width * 0.61) {
          updateDoc(suggestionRef, {
            status: "inprogress",
          });
        } else if (info.point.x > width * 0.61) {
          updateDoc(suggestionRef, {
            status: "live",
          });
        }
      }}
      // onClick={() => router.push(`/${userInfo?.username}/${props.slug}`)}
      className="relative mt-8 flex cursor-pointer flex-col rounded-lg bg-white px-5 py-8"
      variants={childrenVariants}
    >
      <div
        className={`absolute top-0 left-0 h-3 w-full rounded-t-lg ${
          props.status == "planned"
            ? "bg-[#E8A28A]"
            : props.status == "live"
            ? "bg-[#63BCF9]"
            : "bg-pallet-100"
        }`}
      ></div>
      <div className="absolute top-1.5 left-0 h-2 w-full rounded-t-full bg-white"></div>

      <span className="text-pallet-600 mb-2 text-xl font-bold">
        {props.title}
      </span>
      <span className="text-pallet-700 text-md text-justify font-light leading-6">
        {props.description}
      </span>
      <div className="flex items-center justify-start">
        <div
          className={`bg-pallet-400 mt-5 rounded-lg px-5 py-1.5 ${
            props.category == "ux" || props.category == "ui"
              ? "uppercase"
              : "capitalize"
          } text-pallet-300 px-2`}
        >
          {props.category}
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <div
          className="bg-pallet-500 flex items-center justify-center rounded-xl px-4 py-2"
          onClick={handleUpvote}
        >
          <IoIosArrowUp size="16" className="text-pallet-200 mr-2" />
          {props.upvotes}
        </div>
        <div className="flex">
          <FaComment size="24" className="mr-3 text-[#CDD2EE]" />
          <span className="text-pallet-600 font-bold">
            {props.commentCount}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default SuggestionCard;
