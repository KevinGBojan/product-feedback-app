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
      router.push("/enter");
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
    // <Link href={`/${userInfo?.username}/${props.slug}`}>
    <motion.div
      drag
      dragSnapToOrigin={true}
      dragElastic={0.8}
      onDragEnd={(e, info) => {
        if (info.point.x > 0 && info.point.x < width * 0.39) {
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
      className="bg-white mt-8 px-5 py-8 rounded-lg relative flex flex-col cursor-pointer"
      variants={childrenVariants}
    >
      <div
        className={`absolute top-0 left-0 w-full h-3 rounded-t-lg ${
          props.status == "planned"
            ? "bg-[#E8A28A]"
            : props.status == "live"
            ? "bg-[#63BCF9]"
            : "bg-pallet-100"
        }`}
      ></div>
      <div className="absolute top-1.5 left-0 h-2 w-full rounded-t-full bg-white"></div>

      <span className="text-xl text-pallet-600 font-bold mb-2">
        {props.title}
      </span>
      <span className="text-pallet-700 font-light text-md leading-6 text-justify">
        {props.description}
      </span>
      <div className="flex justify-start items-center">
        <div
          className={`bg-pallet-400 rounded-lg px-5 py-1.5 mt-5 ${
            props.category == "ux" || props.category == "ui"
              ? "uppercase"
              : "capitalize"
          } px-2 text-pallet-300`}
        >
          {props.category}
        </div>
      </div>
      <div className="flex justify-between items-center mt-5">
        <div
          className="bg-pallet-500 flex items-center justify-center px-4 py-2 rounded-xl"
          onClick={handleUpvote}
        >
          <IoIosArrowUp size="16" className="text-pallet-200 mr-2" />
          {props.upvotes}
        </div>
        <div className="flex">
          <FaComment size="24" className="text-[#CDD2EE] mr-3" />
          <span className="text-pallet-600 font-bold">
            {props.commentCount}
          </span>
        </div>
      </div>
    </motion.div>
    // </Link>
  );
};

export default SuggestionCard;
