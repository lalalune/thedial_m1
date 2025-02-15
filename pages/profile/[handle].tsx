import { NextPage } from "next";
import Image from "next/legacy/image";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAccount } from "wagmi";
import NotFound from "../../components/Common/NotFound/NotFound";
import Banner from "../../components/Common/Profile/modules/Banner";
import useProfilePage from "../../components/Home/Profile/hooks/useProfilePage";
import SideBar from "../../components/Home/Profile/modules/SideBar";
import checkDispatcher from "../../lib/lens/helpers/checkDispatcher";
import createProfilePicture from "../../lib/lens/helpers/createProfilePicture";
import handleHidePost from "../../lib/lens/helpers/handleHidePost";
import { setWalletConnected } from "../../redux/reducers/walletConnectedSlice";
import { RootState } from "../../redux/store";
import ProfileTab from "./../../components/Home/Layout/Account/modules/ProfileTab";
import { useMediaQuery } from "@material-ui/core";

const Profile: NextPage = (): JSX.Element => {
  const {
    profileDataLoading,
    profileData,
    getMoreUserProfileFeed,
    userFeed,
    followLoading,
    followProfile,
    unFollowProfile,
    dispatch,
    isFollowedByMe,
    isFollowing,
    hasMirrored,
    hasCommented,
    hasReacted,
    reactionsFeed,
    getMoreUserMixtapes,
    hotReactionsFeed,
    hasHotReacted,
    hasHotMirrored,
    hasHotCommented,
    mixtapes,
    mixtapeMirror,
    handleSendDM,
    followerOnly,
  } = useProfilePage();
  const { isConnected } = useAccount();
  const profileId = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  useEffect(() => {
    dispatch(setWalletConnected(isConnected));
  }, [isConnected]);
  useEffect(() => {
    checkDispatcher(dispatch, profileId);
  }, [profileId]);

  const profileImage = createProfilePicture(profileData);
  let queryWindowSize900 = useMediaQuery("(max-width:900px)");

  if (!profileData && profileDataLoading === false) {
    return <NotFound />;
  }

  return (
    <div className="relative h-fit w-full bg-black/70 grid grid-flow-col auto-col-auto overflow-hidden">
      {(profileDataLoading || profileDataLoading === undefined) &&
      !profileData &&
      reactionsFeed?.length === 0 ? (
        <div className="relative w-full h-screen col-start-1 grid grid-flow-col auto-cols-auto"></div>
      ) : (
        <div className="relative w-full h-full grid grid-flow-row auto-rows-auto col-start-1">
          <Banner coverPicture={profileData?.coverPicture} />
          <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto row-start-2">
            <div className="absolute w-fit h-fit grid grid-flow-col auto-cols-auto px-10">
              <div
                id="crt"
                className="relative w-48 h-48 col-start-1 rounded-full grid grid-flow-col auto-cols-auto z-10 -top-20 border-2 border-offBlack"
              >
                {profileImage && (
                  <Image
                    src={profileImage}
                    layout={"fill"}
                    objectFit="cover"
                    objectPosition={"center"}
                    className="rounded-full"
                  />
                )}
              </div>
            </div>
            <SideBar
              profileData={profileData}
              followLoading={followLoading}
              followProfile={followProfile}
              unFollowProfile={unFollowProfile}
              isFollowedByMe={isFollowedByMe}
              isFollowing={isFollowing}
              dispatch={dispatch}
              getMoreUserMixtapes={getMoreUserMixtapes}
              hotReactionsFeed={hotReactionsFeed}
              hasHotReacted={hasHotReacted}
              hasHotMirrored={hasHotMirrored}
              hasHotCommented={hasHotCommented}
              mixtapes={mixtapes}
              handleHidePost={handleHidePost}
              handleSendDM={handleSendDM}
            />
            <div
              className={`relative w-full h-fit grid grid-flow-col auto-cols-auto px-3 fo:px-10 py-4 bg-offWhite/90 overflow-y-scroll ${
                !queryWindowSize900
                  ? "col-start-2 row-start-1"
                  : "col-start-1 row-start-2"
              }`}
            >
              <ProfileTab
                getMoreUserProfileFeed={getMoreUserProfileFeed}
                userFeed={userFeed}
                dispatch={dispatch}
                height={"500rem"}
                hasMirrored={hasMirrored}
                hasCommented={hasCommented}
                hasReacted={hasReacted}
                reactionsFeed={reactionsFeed}
                mixtapeMirror={mixtapeMirror}
                handleHidePost={handleHidePost}
                followerOnly={followerOnly}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
