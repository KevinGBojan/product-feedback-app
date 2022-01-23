import { useGetUserSuggestion } from "../../../lib/Hooks/useGetUserSuggestion";
import { useGetUserWithUsername } from "../../../lib/Hooks/useGetUserWithUsername";
import { useRouter } from "next/router";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import Suggestion from "../../../components/Suggestion";

export default function Comments({}) {
  const { query } = useRouter();
  const { userId } = useGetUserWithUsername(query.username);

  const { suggestion } = useGetUserSuggestion(userId?.uid, query.slug);

  return (
    <main className="mt-10 w-1/3 mx-auto flex flex-col justify-center items-left">
      <Link href="/">
        <div className="text-pallet-700 font-bold flex cursor-pointer">
          <IoIosArrowBack size="24" className="text-pallet-200 mr-2" />
          <span>Go Back</span>
        </div>
      </Link>
      <Suggestion
        slug={suggestion?.slug}
        uid={suggestion?.uid}
        category={suggestion?.category}
        title={suggestion?.title}
        commentsLength={suggestion?.comments.length}
        description={suggestion?.description}
        createdAt={suggestion?.createdAt}
        upvotes={suggestion?.upvotes}
      />
      <div className="bg-white mt-8">
        <span className="text-pallet-600 font-bold">Add Comment</span>
      </div>
    </main>
  );
}
