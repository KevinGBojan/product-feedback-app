import { useEffect, useState } from "react";
import Image from "next/image";
import { useGetSuggestions } from "../lib/Hooks/useGetSuggestions";
import { RiLightbulbFlashFill } from "react-icons/ri";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import { useGetUserInfo } from "../lib/Hooks/useGetUserInfo";
import { SignOut } from "./enter";

import Suggestion from "../components/Suggestion";
import Link from "next/link";
import { motion } from "framer-motion";

// Icons
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { AiOutlineCheck } from "react-icons/ai";
import { FaSignOutAlt } from "react-icons/fa";

const Home = () => {
  // TODO: Animations
  // TODO: Loading Spinner
  // TODO: Filtering

  const { userInfo } = useGetUserInfo();
  const { user, username } = useContext(UserContext);
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

  // useEffect(() => {
  //   console.log(suggestions);
  // }, [suggestions]);

  const SignOutModal = () => {
    SignOut();
    setSignOut(false);
  };

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.5,
      },
    },
  };

  return (
    <div className="w-3/4 flex mx-auto pt-20">
      <div className="w-1/4 mr-12">
        <div className=" bg-gradient-to-tr from-[#28A7ED] via-[#A337F6] to-[#E84D70] rounded-xl px-8 py-6 text-white">
          <div className="flex flex-col">
            {user && userInfo ? (
              <div
                className="flex relative cursor-pointer"
                onClick={() => setSignOut(!signOut)}
              >
                <Image
                  src={userInfo.avatarURL}
                  height="40"
                  width="40"
                  className="rounded-full"
                />
                <div className="flex flex-col ml-4 text-xs">
                  <span className="text-sm">{userInfo.displayName}</span>
                  <span className="font-bold">@{userInfo.username}</span>
                </div>
              </div>
            ) : (
              <Link href="/enter">
                <div className="flex items-center font-light cursor-pointer">
                  <FaSignOutAlt size="24" className="mr-2" /> Login
                </div>
              </Link>
            )}
            <h2 className="mt-14 mb-4">Frontend Mentor</h2>
            <span className="text-white/75">Feedback Board</span>
            {signOut && (
              <div
                className="absolute flex items-center mt-12 bg-white w-[150px] text-[#D73737] hover:text-pallet-100 px-3 text-sm font-light py-2 rounded-lg cursor-pointer"
                onClick={SignOutModal}
              >
                <FaSignOutAlt size="16" className="mr-2" />
                <span>Sign Out</span>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white mt-10 rounded-xl flex flex-wrap justify-left items-center p-4">
          {categories.map((category) => (
            <div className="px-2 py-2" key={category}>
              <button
                className={`capitalize px-3 py-2 bg-pallet-500 text-pallet-200 text-md rounded-md ${
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
        <div className="bg-white mt-10 rounded-xl flex flex-col justify-left items-center py-8 px-6">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-lg text-pallet-600 font-bold">Roadmap</span>
            <Link href="/roadmap">
              <span className="text-sm text-pallet-200 cursor-pointer">
                View
              </span>
            </Link>
          </div>
          <div className="w-full flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-[#F49F85] mr-4"></div>
                <span className="font-light">Planned</span>
              </div>
              <span className="font-bold text-pallet-600"> {0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-pallet-100 mr-4"></div>
                <span className="font-light">In Progress</span>
              </div>
              <span className="font-bold text-pallet-600"> {0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-pallet-200 mr-4"></div>
                <span className="font-light">Live</span>
              </div>
              <span className="font-bold text-pallet-600"> {0}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-3/4">
        <div className="bg-pallet-600 text-white w-full px-8 py-3 rounded-lg flex items-center justify-between">
          <div className="flex">
            <RiLightbulbFlashFill size="24" />
            <div className="flex text-lg tracking-wider font-bold ml-4">
              <span className="mr-2">
                {suggestions ? suggestions.length : 0}
              </span>
              <span>Suggestions</span>
            </div>
          </div>

          <div className="text-lg flex items-center relative">
            <div
              className="mr-2 text-pallet-400 text-sm flex items-center cursor-pointer"
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
              <div className="absolute top-14 shadow-lg bg-white h-[210px] w-[250px] rounded-xl flex flex-col justify-between py-4">
                {filters.map((filter) => (
                  <button
                    className="w-full flex items-center justify-between capitalize px-3 py-3 text-sm font-light  text-gray-900 text-md hover:text-pallet-100 border-gray-100"
                    onClick={() => {
                      // add or remove category from orderFilter, depending on whether it's in it already
                      setOrderFilter(filter);
                      setDropdown(false);
                    }}
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
          <Link href="/feedback">
            <button className="bg-pallet-100 font-bold text-sm text-pallet-400 px-6 py-3 rounded-lg">
              + Add Feedback
            </button>
          </Link>
        </div>
        <div>
          {suggestions ? (
            <motion.div
              className="pb-40"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {suggestions.reverse().map((suggestion) => (
                <Suggestion
                  key={suggestion.slug}
                  slug={suggestion.slug}
                  uid={suggestion.uid}
                  category={suggestion.category}
                  title={suggestion.title}
                  description={suggestion.description}
                  createdAt={suggestion.createdAt}
                  upvotes={suggestion.upvotes}
                />
              ))}
            </motion.div>
          ) : (
            <NoFeedbackYet />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

function NoFeedbackYet() {
  return (
    <div className="bg-white flex flex-col items-center justify-center py-40 mt-10 rounded-lg">
      <Image
        src="/../public/assets/suggestions/illustration-empty.svg"
        height="136.74"
        width="129.64"
      />
      <h3 className="text-pallet-600 mt-10">There is no feedback yet.</h3>
      <p className="text-pallet-700 my-10 text-lg w-1/2 text-center">
        Got a suggestion? Found a bug that needs to be squashed? We love hearing
        about new ideas to improve our app.
      </p>
      <Link href="/feedback">
        <button className="bg-pallet-100 font-bold text-sm text-pallet-400 px-6 py-3 rounded-lg">
          + Add Feedback
        </button>
      </Link>
    </div>
  );
}
