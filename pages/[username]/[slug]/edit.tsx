import FeedbackForm from "../../../components/FeedbackForm";
import { useGetUserWithUsername } from "../../../lib/Hooks/useGetUserWithUsername";
import { useRouter } from "next/router";

export default function Page({}) {
  const router = useRouter(); // fetch username and suggestion slug from URL
  const { userId } = useGetUserWithUsername(router.query.username); // get user UID with username

  // the form needs: user uid, slug, needs to know if edit or not,

  return (
    <main>
      <FeedbackForm uid={userId?.uid} slug={router.query.slug} edit={true} />
    </main>
  );
}
