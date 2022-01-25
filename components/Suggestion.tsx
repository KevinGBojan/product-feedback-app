import { useContext } from "react";
import Image from "next/image";
import Link from "next/link";

// Firebase
import { useGetUserInfo } from "../lib/Hooks/useGetUserInfo";
import { db } from "../lib/firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
  Timestamp,
} from "firebase/firestore";

// Auth
import { UserContext } from "../lib/context";

// Icons
import { IoIosArrowUp } from "react-icons/io";
import { FaComment } from "react-icons/fa";

// Notifications
import toast from "react-hot-toast";

// Animation
import { motion } from "framer-motion";

// Routing
import { useRouter } from "next/router";

// This component renders out the suggestion card that shows up on the homepage
// and in the comments section. It takes a uid of the user that made the suggestion
// and uses it to fetch the user data. It also takes the slug so it can be injected
// in the URL and also takes suggestion details i.e., title, description, timestamp,
// etc

interface suggestionType {
  slug: string;
  uid: string;
  createdAt: Timestamp;
  title: string;
  description: string;
  upvotes: number;
  category: string;
  commentCount: number;
}

const Suggestion = (props: suggestionType) => {
  const router = useRouter();
  const { user } = useContext(UserContext); // fetch user who is logged in
  const { userInfo } = useGetUserInfo(props.uid); // fetch user who made the suggestion

  let date = props.createdAt?.toDate();

  // function checks if user upvoted the suggestion already and returns an error message if that is the case.
  // otherwise, it increments the count on the suggestion doc and also adds a doc with user uid in the upvotes
  // collection.

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
      await setDoc(upvoteRef, { uid: `${user?.uid}` }).then(() =>
        toast.success("Request upvoted successfully!")
      );
    }
  };

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

  return (
    <motion.div
      className="bg-white px-8 py-8 flex mt-8 rounded-lg"
      variants={childrenVariants}
    >
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
              <div className="flex justify-start items-center">
                <div
                  className={`bg-pallet-400 rounded-lg px-5 py-1.5 mt-3 ${
                    props.category == "ux" || props.category == "ui"
                      ? "uppercase"
                      : "capitalize"
                  } px-2 text-pallet-300`}
                >
                  {props.category}
                </div>
              </div>
            </div>
            <div className="flex">
              <FaComment size="24" className="text-[#CDD2EE] mr-3" />
              <span className="text-pallet-600 font-bold">
                {props.commentCount}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default Suggestion;
