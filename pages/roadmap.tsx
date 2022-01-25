import { motion } from "framer-motion";
import { UserContext } from "../lib/context";
import { useRouter } from "next/router";
import { useContext } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useGetSuggestionsRoadmap } from "../lib/Hooks/useGetSuggestionsRoadmap";

export default function Page({}) {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const { suggestions } = useGetSuggestionsRoadmap();

  console.log(suggestions);

  return (
    <main className="w-2/3 mx-auto mt-12">
      <div className="bg-pallet-600 text-white w-full p-8 rounded-lg flex items-center justify-between">
        <div className="flex flex-col items-end justify-end">
          <div
            className="text-pallet-500 font-bold flex cursor-pointer mb-5"
            onClick={() => router.back()}
          >
            <IoIosArrowBack size="24" className="text-pallet-500 mr-2" />
            <span>Go Back</span>
          </div>
          <h2>Roadmap</h2>
        </div>
        <button
          className="bg-pallet-100 font-bold text-sm text-pallet-400 px-6 py-3 rounded-lg"
          onClick={() =>
            user ? router.push("/feedback") : router.push("/enter")
          }
        >
          + Add Feedback
        </button>
      </div>
      <div className="w-full flex mt-12">
        <div className="w-1/3 flex flex-col">
          {/* {suggestions?.filter((suggestion) => suggestion.status === "p")} */}
          <h3>Planned</h3>
        </div>
        <div className="w-1/3 flex flex-col">
          <h3>Planned</h3>
        </div>
        <div className="w-1/3 flex flex-col">
          <h3>Planned</h3>
        </div>
      </div>
    </main>
  );
}
