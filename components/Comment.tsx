import { useGetUserInfo } from "../lib/Hooks/useGetUserInfo";
import Image from "next/image";

// This component takes a user uid to fetch the user who wrote it
// and a timestamp as well as a comment to render out an individual
// comment

interface commentType {
  uid: string;
  createdAt: any;
  comment: string;
}

const Comment = (props: commentType) => {
  const { userInfo } = useGetUserInfo(props.uid);
  let date = props.createdAt?.toDate();

  return (
    <>
      {userInfo && (
        <div className="mt-8">
          <div className="flex">
            <Image
              src={userInfo.avatarURL}
              height="35"
              width="35"
              className="rounded-full"
            />
            <div className="flex justify-center ml-4">
              <div className="flex flex-col mr-3">
                <span className="text-pallet-600 font-bold text-xs">
                  {userInfo.displayName}
                </span>
                <span className="text-pallet-700 font-light text-xs">
                  @{userInfo.username}
                </span>
              </div>
              <span className="text-[#647196] font-light text-xs">
                {new Intl.DateTimeFormat("en-GB", {
                  month: "short",
                  day: "2-digit",
                  hour: "numeric",
                  minute: "numeric",
                }).format(date)}
              </span>
            </div>
          </div>
          <div className="mt-4 text-sm text-pallet-700 font-light">
            {props.comment}
          </div>
        </div>
      )}
    </>
  );
};

export default Comment;
