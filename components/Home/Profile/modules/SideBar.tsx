import Link from "next/link";
import { FunctionComponent } from "react";
import {
  AiOutlineLoading,
  AiOutlineUsergroupAdd,
  AiOutlineUsergroupDelete,
} from "react-icons/ai";
import { INFURA_GATEWAY } from "../../../../lib/lens/constants";
import { SideBarProps } from "../types/profile.types";
import lodash from "lodash";
import { FaWpexplorer } from "react-icons/fa";
import { SlLocationPin } from "react-icons/sl";
import { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";

const SideBar: FunctionComponent<SideBarProps> = ({
  profileData,
  followLoading,
  followProfile,
  unFollowProfile,
  isFollowedByMe,
  isFollowing
}): JSX.Element => {
  let profileImage: string;
  if (!(profileData?.picture as any)?.original) {
    profileImage = "";
  } else if ((profileData?.picture as any)?.original) {
    if ((profileData?.picture as any)?.original?.url.includes("http")) {
      profileImage = (profileData?.picture as any)?.original.url;
    } else {
      const cut = (profileData?.picture as any)?.original?.url.split("//");
      profileImage = `${INFURA_GATEWAY}/ipfs/${cut[1]}`;
    }
  } else {
    profileImage = (profileData?.picture as any)?.uri;
  }

  const location = lodash.filter(
    profileData?.attributes,
    (attribute) => attribute.key === "location"
  );
  const website = lodash.filter(
    profileData?.attributes,
    (attribute) => attribute?.key === "website"
  );
  const lensProfile = useSelector((state: RootState) => state.app.lensProfileReducer.profile?.id)

  return (
    <div className="col-start-1 relative w-full h-full grid grid-flow-row auto-rows-auto bg-offWhite/95 row-start-1 px-14 pt-40 pb-10 col-span-1 pr-4">
      <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto row-start-1 self-start">
        <div className="relative w-full h-full grid grid-flow-row auto-rows-auto row-start-1 pb-6">
          <div className="relative w-fit h-fit font-dosis text-offBlack row-start-1 text-4xl justify-self-start self-center">
            {profileData?.name}
          </div>
          <div
            id="profile"
            className="relative w-fit h-fit font-dosis text-xl justify-self-start self-center"
          >
            @{profileData?.handle}
          </div>
        </div>
        { profileData?.id !== lensProfile  && <div
          className={`${
            !followLoading && "cursor-pointer active:scale-95 hover:opacity-80"
          } relative w-fit h-fit py-2 px-5 row-start-2 justify-self-start self-center rounded-lg bg-offBlue/80 grid grid-flow-col auto-cols-auto`}
          onClick={() => {
            followLoading
              ? {}
              : isFollowedByMe
              ? unFollowProfile()
              : followProfile();
          }}
        >
          <div className="relative w-fit h-fit place-self-center text-white font-dosis grid grid-flow-col auto-cols-auto gap-1">
            <div
              className={`relative w-fit h-fit col-start-1 place-self-center ${
                followLoading && "animate-spin"
              }`}
            >
              {followLoading ? (
                <AiOutlineLoading color="white" size={17} />
              ) : isFollowedByMe ? (
                <AiOutlineUsergroupDelete color="white" size={17} />
              ) : (
                <AiOutlineUsergroupAdd color="white" size={17} />
              )}
            </div>
            <div className="relative w-fit h-fit col-start-2 place-self-center text-sm">
              {isFollowedByMe ? "Unfollow" : "Follow"}
            </div>
          </div>
        </div>}
        <div className="relative w-full h-full grid grid-flow-row auto-rows-auto row-start-3 pt-6">
          <div className="relative w-fit h-fit col-start-1 font-dosis text-offBlack justify-self-start text-left self-center">
            {profileData?.bio}
          </div>
        </div>
        <div className="relative w-fit h-fit grid grid-flow-col auto-cols-auto row-start-4 text-offBlack font-dosis text-lg gap-4 pt-4 pb-4">
          <div className="relative w-fit h-fit col-start-1 grid grid-flow-col auto-cols-auto gap-2">
            <div className="relative w-fit h-fit col-start-1">
              {profileData?.stats?.totalFollowing}
            </div>
            <div className="relative w-fit h-fit col-start-2">Following</div>
          </div>
          <div className="relative w-fit h-fit col-start-2 grid grid-flow-col auto-cols-auto gap-2">
            <div className="relative w-fit h-fit col-start-1">
              {profileData?.stats?.totalFollowers}
            </div>
            <div className="relative w-fit h-fit col-start-2">Followers</div>
          </div>
        </div>
        {isFollowing && (
          <div className="relative w-fit h-fit row-start-5 grid grid-flow-col auto-cols-auto drop-shadow-md bg-gray-100/50 font-dosis text-sm text-black justify-self-start self-center py-2 px-4 rounded-lg">
            <div className="relative w-fit h-fit col-start-1 place-self-center">
              Following You
            </div>
          </div>
        )}
        <div className="relative pt-4 row-start-6 grid grid-flow-col auto-cols-auto text-sm text-offBlack gap-1 w-fit h-fit">
          <div className="relative w-fit h-fit col-start-1">Id:</div>
          <div className="relative w-fit h-fit col-start-2">
            #{profileData?.id}
          </div>
        </div>
        <div className="relative w-fit h-fit row-start-7 pt-4 grid grid-flow-row auto-rows-auto gap-3 text-offBlack">
          {website[0]?.value && (
            <div className="relative w-fit h-fit row-start-1 grid grid-flow-col auto-cols-auto gap-3 justify-self-start self-center">
              <div className="relative w-fit h-fit col-start-1 place-self-center">
                <FaWpexplorer size={15} color={"#81A8F8"} />
              </div>
              <Link
                legacyBehavior
                href={
                  website[0]?.value.includes("https")
                    ? website[0]?.value
                    : "https://" + website[0]?.value
                }
                className="relative w-fit h-fit col-start-2 place-self-center cursor-pointer hover:opacity-80 active:scale-95"
              >
                <a target={"_blank"} rel="noreferrer">
                  {website[0]?.value}
                </a>
              </Link>
            </div>
          )}
          {location[0]?.value && (
            <div
              className={`relative w-fit h-fit ${
                website[0]?.value ? "row-start-2" : "row-start-1"
              } grid grid-flow-col auto-cols-auto gap-3 justify-self-start self-center`}
            >
              <div className="relative w-fit h-fit col-start-1 place-self-center">
                <SlLocationPin size={15} color={"#81A8F8"} />
              </div>
              <div className="relative w-fit h-fit col-start-2 place-self-center">
                {location[0]?.value}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
