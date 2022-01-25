import Link from "next/link";
import React from "react";
import { useGetUserInfo } from "../lib/Hooks/useGetUserInfo";
import { IoIosArrowUp } from "react-icons/io";
import { FaComment } from "react-icons/fa";

// Animation
import { motion } from "framer-motion";

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
  const { userInfo } = useGetUserInfo(props.uid);

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
    <Link href={`/${userInfo?.username}/${props.slug}`}>
      <motion.div
        className="bg-white mt-8 px-5 py-8 rounded-lg relative flex flex-col"
        variants={childrenVariants}
      >
        <div
          className={`absolute top-0 left-0 w-full h-2 rounded-tr-lg rounded-tl-lg ${
            props.status == "planned"
              ? "bg-[#E8A28A]"
              : props.status == "live"
              ? "bg-[#63BCF9]"
              : "bg-pallet-100"
          }`}
        ></div>
        <div className="absolute top-0 left-0 w-full bg-white"></div>

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
          <div className="bg-pallet-500 flex items-center justify-center px-4 py-2 rounded-xl">
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
    </Link>
  );
};

export default SuggestionCard;
