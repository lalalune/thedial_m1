import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import useAccount from "./hooks/useAccount";
import useProfile from "./hooks/useProfile";
import AccountTab from "./modules/AccountTab";
import ProfileTab from "./modules/ProfileTab";
import StatsTab from "./modules/StatsTab";
import { setSignIn } from "../../../../redux/reducers/signInSlice";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Notifications from "./modules/Notifications";
import useNotifications from "./hooks/useNotifications";
import Conversations from "./modules/Conversations";
import useConversations from "./hooks/useConversations";
import handleHidePost from "../../../../lib/lens/helpers/handleHidePost";
import useParameters from "../Publish/modules/Parameters/hooks/useParameters";

const AccountSwitch: FunctionComponent = (): JSX.Element => {
  const accountType: string | undefined = useSelector(
    (state: RootState) => state.app.accountPageReducer.value
  );
  const chosenProfile = useSelector(
    (state: RootState) => state.app.chosenDMProfileReducer.profile
  );
  const client = useSelector(
    (state: RootState) => state.app.xmtpClientReducer.value
  );
  const {
    profileImage,
    coverImage,
    accountImageUpload,
    profileImageUploading,
    coverImageUploading,
    accountLoading,
    setProfileData,
    profileImageSet,
    profileLoading,
    followLoading,
    handleFollowModule,
    followFee,
    setFollowFee,
    value,
    setValue,
    enabledCurrencies,
    setEnabledCurrency,
    currencyDropDown,
    setCurrencyDropDown,
    enabledCurrency,
  } = useAccount();
  const dispatch = useDispatch();
  const {
    profileDataLoading,
    getMoreUserProfileFeed,
    userFeed,
    hasMirrored,
    hasCommented,
    hasReacted,
    reactionsFeed,
    userFollowers,
    userFollowing,
    getMoreFollowers,
    getMoreFollowing,
    followersLoading,
    followingLoading,
    mixtapeMirror,
    followerOnly,
  } = useProfile();
  const {
    createClient,
    searchMessages,
    clientLoading,
    searchLoading,
    searchMoreMessages,
    sendConversation,
    profileSearch,
    handleMessage,
    handleChosenProfile,
    searchTarget,
    dropdown,
    previewMessages,
    profileLensData,
    conversationMessages,
    message,
    textElement,
    messageLoading,
    caretCoord,
    handleMentionClick,
    profilesOpen,
    mentionProfiles,
    handleEmoji,
    openImagePicker,
    setOpenImagePicker,
    conversationLoading,
    onNetwork,
    handleGif,
    handleSetGif,
    handleGifSubmit,
    results,
    handleUploadImage,
    allConversationsLoading
  } = useConversations();
  const { getMoreNotifications, notificationsList, notificationsLoading } =
    useNotifications();
  const { dispatcherLoading, setDispatcherEnabled } = useParameters();
  const profile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const authStatus = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const isConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const dispatcher = useSelector(
    (state: RootState) => state.app.dispatcherReducer.value
  );
  const { openConnectModal } = useConnectModal();
  let action: string = "account";
  const decideStringAction = () => {
    if (authStatus && isConnected) {
      action = accountType as string;
    } else {
      action = "no profile";
    }

    return action;
  };

  switch (decideStringAction()) {
    case "profile feed":
      return (
        <ProfileTab
          getMoreUserProfileFeed={getMoreUserProfileFeed}
          userFeed={userFeed}
          dispatch={dispatch}
          height={"44rem"}
          hasMirrored={hasMirrored}
          hasCommented={hasCommented}
          hasReacted={hasReacted}
          reactionsFeed={reactionsFeed}
          profileDataLoading={profileDataLoading}
          mixtapeMirror={mixtapeMirror}
          handleHidePost={handleHidePost}
          followerOnly={followerOnly}
        />
      );

    case "stats":
      return (
        <StatsTab
          profile={profile}
          userFollowing={userFollowing}
          userFollowers={userFollowers}
          getMoreFollowers={getMoreFollowers}
          getMoreFollowing={getMoreFollowing}
          followersLoading={followersLoading}
          followingLoading={followingLoading}
        />
      );

    case "notifications":
      return (
        <Notifications
          getMoreNotifications={getMoreNotifications}
          notificationsList={notificationsList}
          notificationsLoading={notificationsLoading}
        />
      );

    case "conversations":
      return (
        <Conversations
          createClient={createClient}
          searchMessages={searchMessages}
          clientLoading={clientLoading}
          searchLoading={searchLoading}
          profileSearch={profileSearch}
          searchMoreMessages={searchMoreMessages}
          sendConversation={sendConversation}
          handleMessage={handleMessage}
          handleChosenProfile={handleChosenProfile}
          searchTarget={searchTarget}
          dropdown={dropdown}
          chosenProfile={chosenProfile}
          previewMessages={previewMessages}
          profileLensData={profileLensData}
          conversationMessages={conversationMessages}
          message={message}
          textElement={textElement}
          messageLoading={messageLoading}
          caretCoord={caretCoord}
          handleMentionClick={handleMentionClick}
          profilesOpen={profilesOpen}
          mentionProfiles={mentionProfiles}
          handleEmoji={handleEmoji}
          openImagePicker={openImagePicker}
          setOpenImagePicker={setOpenImagePicker}
          conversationLoading={conversationLoading}
          client={client}
          onNetwork={onNetwork}
          handleGif={handleGif}
          handleGifSubmit={handleGifSubmit}
          results={results}
          handleSetGif={handleSetGif}
          handleUploadImage={handleUploadImage}
          allConversationsLoading={allConversationsLoading}
        />
      );

    case "no profile":
      return (
        <div
          className="relative w-fit h-fit place-self-center font-dosis text-offBlack text-base cursor-pointer"
          onClick={
            !isConnected ? openConnectModal : () => dispatch(setSignIn(true))
          }
        >
          Please Connect to Lens to view your Account page.
        </div>
      );

    case undefined:
      return <></>;

    default:
      return (
        <AccountTab
          profile={profile}
          accountImageUpload={accountImageUpload}
          profileImageUploading={profileImageUploading}
          coverImageUploading={coverImageUploading}
          profileImage={profileImage}
          coverImage={coverImage}
          accountLoading={accountLoading}
          setProfileData={setProfileData}
          profileImageSet={profileImageSet}
          profileLoading={profileLoading}
          dispatcher={dispatcher}
          dispatcherLoading={dispatcherLoading}
          setDispatcherEnabled={setDispatcherEnabled}
          handleFollowModule={handleFollowModule}
          followLoading={followLoading}
          followFee={followFee}
          setFollowFee={setFollowFee}
          value={value}
          setValue={setValue}
          enabledCurrencies={enabledCurrencies}
          setEnabledCurrency={setEnabledCurrency}
          currencyDropDown={currencyDropDown}
          setCurrencyDropDown={setCurrencyDropDown}
          enabledCurrency={enabledCurrency}
        />
      );
  }
};

export default AccountSwitch;
