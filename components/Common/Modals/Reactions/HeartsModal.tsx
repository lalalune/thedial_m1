import Image from "next/legacy/image";
import React, { FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { setReactionState } from "../../../../redux/reducers/reactionStateSlice";
import { RootState } from "../../../../redux/store";
import { ReactionModalProps } from "../../types/common.types";
import lodash from "lodash";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { setSignIn } from "../../../../redux/reducers/signInSlice";
import createProfilePicture from "../../../../lib/lens/helpers/createProfilePicture";
import { useRouter } from "next/router";

const HeartsModal: FunctionComponent<ReactionModalProps> = ({
  reacters,
  getMorePostReactions,
  reactionLoading,
  reactionPost,
  reactionInfoLoading,
}): JSX.Element | null => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pubId = useSelector(
    (state: RootState) => state.app.reactionStateReducer.value
  );
  const isConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const lensProfile: string = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const hasReacted = lodash.filter(
    reacters,
    (reaction) => (reaction as any)?.profile?.id === lensProfile
  );
  const { openConnectModal } = useConnectModal();
  return (
    <div className="inset-0 justify-center fixed z-20 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-full md:w-[40vw] h-fit col-start-1 place-self-center bg-offBlue/70 rounded-lg p-2">
        <div className="relative bg-white w-full h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center grid grid-flow-row auto-rows-auto gap-10 pb-8">
            <div
              className="relative w-fit h-fit row-start-1 self-center justify-self-end pr-3 pt-3 cursor-pointer"
              onClick={() =>
                dispatch(
                  setReactionState({
                    actionOpen: false,
                    actionType: "heart",
                    actionValue: pubId,
                  })
                )
              }
            >
              <ImCross color="black" size={15} />
            </div>
            {!reactionInfoLoading ? (
              <>
                {reacters?.length > 0 && (
                  <div className="relative w-full h-fit row-start-2 grid grid-flow-row auto-rows-auto">
                    <InfiniteScroll
                      hasMore={true}
                      dataLength={reacters?.length}
                      next={getMorePostReactions}
                      loader={""}
                      height={"10rem"}
                      className="relative w-full h-fit row-start-1 grid grid-flow-row auto-rows-auto px-4 gap-2"
                    >
                      {reacters?.map((reacter: any, index: number) => {
                        const profileImage = createProfilePicture(
                          reacter?.profile
                        );

                        return (
                          <div
                            onClick={() =>
                              router.push(
                                `/profile/${
                                  reacter?.profile?.handle?.split("lens")[0]
                                }`
                              )
                            }
                            key={index}
                            className="relative w-full h-fit p-2 drop-shadow-lg grid grid-flow-col bg-gray-50 auto-cols-auto rounded-lg border border-gray-50"
                          >
                            <div className="relative w-fit h-fit grid grid-flow-col auto-cols-auto col-start-1 gap-6">
                              <div className="relative w-8 h-8 rounded-full bg-offBlue col-start-1">
                                {profileImage && (
                                  <Image
                                    src={profileImage}
                                    objectFit="cover"
                                    layout="fill"
                                    alt="pfp"
                                    className="relative w-fit h-fit rounded-full self-center"
                                  />
                                )}
                              </div>
                              <div
                                id="handle"
                                className="relative w-fit h-fit place-self-center col-start-2"
                              >
                                @{reacter?.profile?.handle}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </InfiniteScroll>
                  </div>
                )}
                <div
                  className={`relative w-full h-fit ${
                    reacters?.length > 0 ? "row-start-3" : "row-start-2"
                  } grid grid-flow-row auto-rows-auto font-dosis text-black text-center gap-3`}
                >
                  <div className="relative w-fit h-fit row-start-1 place-self-center p-3">
                    {reacters?.length > 0
                      ? hasReacted.length > 0
                        ? "Remove heart?"
                        : "Heart this post?"
                      : "This post has no reactions. Will you be first?"}
                  </div>
                  <div
                    className={`relative w-20 h-10 rounded-md bg-offBlue cursor-pointer hover:opacity-70 active:scale-95 grid grid-flow-col auto-cols-auto text-white font-dosis text-sm place-self-center `}
                    onClick={
                      isConnected
                        ? () => {
                            lensProfile
                              ? reactionPost()
                              : dispatch(setSignIn(true));
                          }
                        : openConnectModal
                    }
                  >
                    <div
                      className={`relative w-fit h-fit col-start-1 place-self-center ${
                        reactionLoading && "animate-spin"
                      }`}
                    >
                      {reactionLoading ? (
                        <AiOutlineLoading color="white" size={20} />
                      ) : hasReacted?.length > 0 ? (
                        "Remove"
                      ) : (
                        "Heart"
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="relative w-[40vw] md:w-full h-60 grid grid-flow-col auto-cols-auto">
                <div className="relative w-fit h-fit col-start-1 place-self-center animate-spin">
                  <AiOutlineLoading color="black" size={20} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeartsModal;
