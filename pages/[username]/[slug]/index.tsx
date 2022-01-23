// import { useGetUserSuggestion } from "../../lib/Hooks/useGetUserSuggestion";

import { useRouter } from "next/router";

export default function Suggestion({}) {
  const { query } = useRouter();
  // const { suggestion } = useGetUserSuggestion(query.slug);

  return <main></main>;
}
