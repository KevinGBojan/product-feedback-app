import Link from "next/link";
import React from "react";
import Tag from "./Tag";

interface SuggestionCardProps {
  title: string;
  description: string;
  status: string;
  category: string;
  upvotes: number;
  slug: string;
  username: string;
}

const SuggestionCard = (props: SuggestionCardProps) => {
  return (
    <Link href={`/${props.username}/${props.slug}`}>
      <div>
        <span className="text-lg text-pallet-600 font-bold">{props.title}</span>
        <span className="text-pallet-700 font-light text-md">
          {props.description}
        </span>
        <Tag item={props.category} />
      </div>
    </Link>
  );
};

export default SuggestionCard;
