import { useState } from "react";
import Image from "next/image";
import { useGetSuggestions } from "../lib/Hooks/useGetSuggestions";
import { RiLightbulbFlashFill } from "react-icons/ri";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import { useGetUserInfo } from "../lib/Hooks/useGetUserInfo";
import { SignOut } from "./enter";
import { useRouter } from "next/router";

import Suggestion from "../components/Suggestion";
import Link from "next/link";
import { motion } from "framer-motion";

// Icons
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { AiOutlineCheck } from "react-icons/ai";
import { FaSignOutAlt } from "react-icons/fa";
import toast from "react-hot-toast";

const Home = () => {
  const router = useRouter();
  const { user, username } = useContext(UserContext);
  const { userInfo } = useGetUserInfo(user?.uid);
  const [signOut, setSignOut] = useState(false);

  // Filtering with categories
  const [categoryFilter, setCategoryFilter] = useState("All");
  const categories = ["All", "UI", "UX", "Enhancement", "Bug", "Feature"];

  // Filtering with orderBy comments and votes
  const [dropdown, setDropdown] = useState(false);
  const [orderFilter, setOrderFilter] = useState("Most Upvotes");
  const filters = [
    "Most Upvotes",
    "Least Upvotes",
    "Most Comments",
    "Least Comments",
  ];

  const { suggestions } = useGetSuggestions(categoryFilter, orderFilter);

  const plannedCount = suggestions?.filter(
    (suggestion) => suggestion.status == "planned"
  ).length;

  const liveCount = suggestions?.filter(
    (suggestion) => suggestion.status == "live"
  ).length;

  const progressCount = suggestions?.filter(
    (suggestion) => suggestion.status == "inprogress"
  ).length;

  const SignOutModal = () => {
    SignOut();
    setSignOut(false);
  };

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  return (
    <div className="mx-auto flex w-3/4 pt-20">
      <div className="mr-12 w-1/4">
        <div className=" rounded-xl bg-gradient-to-tr from-[#28A7ED] via-[#A337F6] to-[#E84D70] px-8 py-6 text-white">
          <div className="flex flex-col">
            {user && userInfo ? (
              <div
                className="relative flex cursor-pointer"
                onClick={() => setSignOut(!signOut)}
              >
                <Image
                  src={userInfo.avatarURL}
                  height="40"
                  width="40"
                  className="rounded-full"
                />
                <div className="ml-4 flex flex-col text-xs">
                  <span className="text-sm">{userInfo.displayName}</span>
                  <span className="font-bold">@{userInfo.username}</span>
                </div>
              </div>
            ) : (
              <Link href="/enter">
                <div className="flex cursor-pointer items-center font-light">
                  <FaSignOutAlt size="24" className="mr-2" /> Login
                </div>
              </Link>
            )}
            <h2 className="mt-14 mb-4">Frontend Mentor</h2>
            <span className="text-white/75">Feedback Board</span>
            {signOut && (
              <div
                className="hover:text-pallet-100 absolute mt-12 flex w-[150px] cursor-pointer items-center rounded-lg bg-white px-3 py-2 text-sm font-light text-[#D73737]"
                onClick={SignOutModal}
              >
                <FaSignOutAlt size="16" className="mr-2" />
                <span>Sign Out</span>
              </div>
            )}
          </div>
        </div>
        <div className="justify-left mt-10 flex flex-wrap items-center rounded-xl bg-white p-4">
          {categories.map((category) => (
            <div className="px-2 py-2" key={category}>
              <button
                className={`bg-pallet-500 text-pallet-200 text-md rounded-md px-3 py-2 capitalize ${
                  categoryFilter == category && "bg-pallet-300 text-pallet-500"
                }`}
                onClick={() => {
                  // add or remove category from currentFilter, depending on whether it's in it already
                  setCategoryFilter(category);
                }}
              >
                {category}
              </button>
            </div>
          ))}
        </div>
        <div className="justify-left mt-10 flex flex-col items-center rounded-xl bg-white py-8 px-6">
          <div className="mb-4 flex w-full items-center justify-between">
            <span className="text-pallet-600 text-lg font-bold">Roadmap</span>
            <Link href="/roadmap">
              <span className="text-pallet-200 cursor-pointer text-sm">
                View
              </span>
            </Link>
          </div>
          <div className="flex w-full flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-4 h-2 w-2 rounded-full bg-[#F49F85]"></div>
                <span className="font-light">Planned</span>
              </div>
              <span className="text-pallet-600 font-bold">{plannedCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-pallet-100 mr-4 h-2 w-2 rounded-full"></div>
                <span className="font-light">In Progress</span>
              </div>
              <span className="text-pallet-600 font-bold">{progressCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-pallet-200 mr-4 h-2 w-2 rounded-full"></div>
                <span className="font-light">Live</span>
              </div>
              <span className="text-pallet-600 font-bold"> {liveCount}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-3/4">
        <div className="bg-pallet-600 flex w-full items-center justify-between rounded-lg px-8 py-3 text-white">
          <div className="flex">
            <RiLightbulbFlashFill size="24" />
            <div className="ml-4 flex text-lg font-bold tracking-wider">
              <span className="mr-2">
                {suggestions ? suggestions.length : 0}
              </span>
              <span>Suggestions</span>
            </div>
          </div>

          <div className="relative flex items-center text-lg">
            <div
              className="text-pallet-400 mr-2 flex cursor-pointer items-center text-sm"
              onClick={() => setDropdown(!dropdown)}
            >
              <span className="mr-1">
                Sort by: <span className="font-bold">{orderFilter}</span>
              </span>
              {dropdown ? (
                <IoIosArrowUp size="16" />
              ) : (
                <IoIosArrowDown size="16" />
              )}
            </div>
            {dropdown && (
              <div className="absolute top-14 flex h-[210px] w-[250px] flex-col justify-between rounded-xl bg-white py-4 shadow-lg">
                {filters.map((filter) => (
                  <button
                    className="text-md hover:text-pallet-100 flex w-full items-center justify-between border-gray-100 px-3 py-3  text-sm font-light capitalize text-gray-900"
                    onClick={() =>
                      // add or remove category from orderFilter, depending on whether it's in it already
                      setOrderFilter(filter)
                    }
                    key={filter}
                  >
                    {filter}
                    {orderFilter == filter && (
                      <AiOutlineCheck
                        size="16"
                        className="hover:text-pallet-100"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            className="bg-pallet-100 text-pallet-400 rounded-lg px-6 py-3 text-sm font-bold"
            onClick={() =>
              user
                ? router.push("/feedback")
                : router
                    .push("/enter")
                    .then(() =>
                      toast.error("Please login to create suggestions!")
                    )
            }
          >
            + Add Feedback
          </button>
        </div>
        <div>
          {suggestions && suggestions.length > 0 ? (
            <motion.div
              className="pb-40"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {suggestions.map((suggestion) => (
                <Suggestion
                  key={suggestion.slug}
                  slug={suggestion.slug}
                  uid={suggestion.uid}
                  commentCount={suggestion.commentCount}
                  category={suggestion.category}
                  title={suggestion.title}
                  description={suggestion.description}
                  createdAt={suggestion.createdAt}
                  upvotes={suggestion.upvotes}
                />
              ))}
            </motion.div>
          ) : (
            <div className="mt-10 flex flex-col items-center justify-center rounded-lg bg-white py-40">
              <Image
                src="/../public/illustration-empty.svg"
                height="136.74"
                width="129.64"
              />
              <h3 className="text-pallet-600 mt-10">
                There is no feedback yet.
              </h3>
              <p className="text-pallet-700 my-10 w-1/2 text-center text-lg">
                Got a suggestion? Found a bug that needs to be squashed? We love
                hearing about new ideas to improve our app.
              </p>
              <button
                className="bg-pallet-100 text-pallet-400 rounded-lg px-6 py-3 text-sm font-bold"
                onClick={() =>
                  user
                    ? router.push("/feedback")
                    : router
                        .push("/enter")
                        .then(() =>
                          toast.error("Please login to create suggestions!")
                        )
                }
              >
                + Add Feedback
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
