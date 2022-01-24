import { useContext } from "react";
import { UserContext } from "../../lib/context";
import FeedbackForm from "../../components/FeedbackForm";

export default function AddFeedback({}) {
  const { user } = useContext(UserContext);

  return (
    <main>
      <FeedbackForm uid={user?.uid} edit={false} />
    </main>
  );
}
