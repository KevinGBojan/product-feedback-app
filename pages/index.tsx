import { useState, useEffect } from "react";
import Image from "next/image";
import { useGetSuggestions } from "../lib/Hooks/useGetSuggestions";
import { RiLightbulbFlashFill } from "react-icons/ri";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import { useGetUserInfo } from "../lib/Hooks/useGetUserInfo";
import { SignOut } from "./enter";
import { FaSignOutAlt } from "react-icons/fa";
import Suggestion from "../components/Suggestion";
import Link from "next/link";
const Home = () => {
  const { userInfo } = useGetUserInfo();
  const { user, username } = useContext(UserContext);
  const [signOut, setSignOut] = useState(false);

  // Filtering with categories
  const [categoryFilter, setCategoryFilter] = useState("All");
  const categories = ["All", "UI", "UX", "Enhancement", "Bug", "Feature"];

  // Filtering with orderBy comments and votes
  const [dropdown, setDropdown] = useState(false);
  const [orderFilter, setOrderFilter] = useState("Most Upvotes");

  const { suggestions, loading, error } = useGetSuggestions(categoryFilter);

  return (
    <div className="w-3/5 flex mx-auto pt-20">
      <div className="w-1/4 mr-12">
        <div className="h-[200px] bg-gradient-to-tr from-[#28A7ED] via-[#A337F6] to-[#E84D70] rounded-xl px-8 py-6 text-white">
          <div className="flex flex-col">
            {userInfo && (
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
                  <span className="">@{userInfo.username}</span>
                </div>
              </div>
            )}
            <h2 className="mt-14 mb-2">Frontend Mentor</h2>
            <span className="text-white/75">Feedback Board</span>
            {signOut && (
              <div
                className="absolute flex items-center mt-12 bg-white w-[150px] text-[#D73737] hover:text-pallet-100 px-3 text-sm font-light py-2 rounded-lg cursor-pointer"
                onClick={SignOut}
              >
                <FaSignOutAlt size="16" className="mr-2" />
                <span>Sign Out</span>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white h-[200px] mt-10 rounded-xl flex flex-wrap justify-left items-center">
          {categories.map((category) => (
            <div className="px-2 py-2" key={category}>
              <button
                className={`capitalize px-5 py-2 ml-2 bg-pallet-500 text-pallet-200 text-md rounded-md ${
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
        <div></div>
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

          <div className="text-lg flex items-center">
            <span className="mr-2 text-pallet-400 text-sm relative">
              Sort by : <span className="font-bold">{orderFilter}</span>
            </span>
            {dropdown && <div className="absolute"></div>}
          </div>
          <Link href="/feedback">
            <button className="bg-pallet-100 font-bold text-md text-pallet-400 px-5 py-3 rounded-lg">
              + Add Feedback
            </button>
          </Link>
        </div>

        {suggestions ? (
          <div>
            {suggestions.map((suggestion) => (
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
          </div>
        ) : (
          <NoFeedbackYet />
        )}
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
      <p className="text-pallet-700 mt-10 text-lg w-1/2 text-center">
        Got a suggestion? Found a bug that needs to be squashed? We love hearing
        about new ideas to improve our app.
      </p>
      <Link href="/feedback">
        <button className="bg-pallet-100 font-bold text-md text-pallet-400 px-5 py-3 rounded-lg">
          + Add Feedback
        </button>
      </Link>
    </div>
  );
}
