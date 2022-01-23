import { useState } from "react";
import Image from "next/image";
import { useGetSuggestions } from "../lib/Hooks/useGetSuggestions";
import { RiLightbulbFlashFill } from "react-icons/ri";
import Link from "next/link";

const Home = () => {
  const [dropdown, setDropdown] = useState(false);
  const [filter, setFilter] = useState();
  const { suggestions, loading, error } = useGetSuggestions();

  return (
    <div className="w-9/12 flex mx-auto pt-20">
      <div className="w-1/4 bg-pallet-100 mr-12">plz</div>
      <div className="w-3/4">
        <div className="bg-pallet-600 text-white w-full px-8 py-5 rounded-lg flex items-center">
          <RiLightbulbFlashFill size="24" />
          <div className="flex text-lg tracking-wider font-bold ml-4 mr-6">
            <span className="mr-2">{suggestions ? suggestions.length : 0}</span>
            <span>Suggestions</span>
          </div>
          <div className="text-lg flex items-center">
            <span className="mr-2 text-pallet-400">Sort by : </span>

            <div className="relative"></div>

            <div className="absolute"></div>
          </div>
        </div>
        {suggestions && suggestions.length > 0 ? (
          <div>plz</div>
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
