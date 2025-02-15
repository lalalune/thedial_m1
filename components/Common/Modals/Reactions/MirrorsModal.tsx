import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import React, { FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { INFURA_GATEWAY } from "../../../../lib/lens/constants";
import { setReactionState } from "../../../../redux/reducers/reactionStateSlice";
import { setSignIn } from "../../../../redux/reducers/signInSlice";
import { RootState } from "../../../../redux/store";
import { MirrorsModalProps } from "../../types/common.types";

const MirrorsModal: FunctionComponent<MirrorsModalProps> = ({
  mirrorers,
  getMorePostMirrors,
  mirrorPost,
  mirrorLoading,
  mirrorInfoLoading,
}): JSX.Element | null => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pubId = useSelector(
    (state: RootState) => state.app.reactionStateReducer?.value
  );
  const hasMirrored = useSelector(
    (state: RootState) => state.app.reactionStateReducer?.mirror
  );
  const isConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer?.value
  );
  const lensProfile: string = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const followerOnly = useSelector(
    (state: RootState) => state.app.reactionStateReducer?.follower
  );
  const { openConnectModal } = useConnectModal();
  return (
    <div className="inset-0 justify-center fixed z-20 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div
        className={`relative h-fit col-start-1 place-self-center bg-offBlue/70 rounded-lg p-2 ${
          mirrorLoading ? "w-[80vw] md:w-[40vw]" : "w-full md:w-[40vw]"
        }`}
      >
        <div className="relative bg-white w-full h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center grid grid-flow-row auto-rows-auto gap-10 pb-8">
            <div
              className="relative w-fit h-fit row-start-1 self-center justify-self-end pr-3 pt-3 cursor-pointer"
              onClick={() =>
                dispatch(
                  setReactionState({
                    actionOpen: false,
                    actionType: "mirror",
                    actionValue: pubId,
                    actionFollower: followerOnly,
                  })
                )
              }
            >
              <ImCross color="black" size={15} />
            </div>
            {!mirrorInfoLoading ? (
              <>
                {mirrorers.length > 0 && (
                  <div className="relative w-full h-fit row-start-2 grid grid-flow-row auto-rows-auto">
                    <InfiniteScroll
                      hasMore={true}
                      dataLength={mirrorers.length}
                      next={getMorePostMirrors}
                      loader={""}
                      height={"10rem"}
                      className="relative w-full h-fit row-start-1 grid grid-flow-row auto-rows-auto px-4 gap-2"
                    >
                      {mirrorers?.map((mirrorer: any, index: number) => {
                        let profileImage: string;
                        if (!(mirrorer?.picture as any)?.original) {
                          profileImage = "";
                        } else if ((mirrorer?.picture as any)?.original) {
                          if (
                            (mirrorer?.picture as any)?.original?.url.includes(
                              "http"
                            )
                          ) {
                            profileImage = (mirrorer?.picture as any)?.original
                              .url;
                          } else {
                            const cut = (
                              mirrorer?.picture as any
                            ).original.url.split("/");
                            profileImage = `${INFURA_GATEWAY}/ipfs/${cut[2]}`;
                          }
                        } else {
                          profileImage = (mirrorer?.picture as any)?.uri;
                        }
                        return (
                          <div
                            onClick={() =>
                              router.push(
                                `/profile/${mirrorer.handle.split("lens")[0]}`
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
                                @{mirrorer?.handle}
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
                    mirrorers?.length > 0 ? "row-start-3" : "row-start-2"
                  } grid grid-flow-row auto-rows-auto font-dosis text-black text-center gap-3`}
                >
                  <div className="relative w-fit h-fit row-start-1 place-self-center p-3">
                    {mirrorers?.length > 0
                      ? "Mirror this post?"
                      : `This post hasn't been mirrored. Will you be first?`}
                  </div>
                  <div
                    className={`relative ${
                      followerOnly
                        ? "w-fit px-1"
                        : "w-20 px-0 cursor-pointer hover:opacity-70 active:scale-95"
                    } h-10 rounded-md bg-offBlue grid grid-flow-col auto-cols-auto text-white font-dosis text-sm place-self-center `}
                    onClick={
                      isConnected
                        ? () => {
                            lensProfile
                              ? followerOnly
                                ? {}
                                : mirrorPost()
                              : dispatch(setSignIn(true));
                          }
                        : openConnectModal
                    }
                  >
                    <div
                      className={`relative w-fit h-fit col-start-1 place-self-center ${
                        mirrorLoading && "animate-spin"
                      }`}
                    >
                      {mirrorLoading ? (
                        <AiOutlineLoading color="white" size={20} />
                      ) : hasMirrored ? (
                        "Mirror again?"
                      ) : followerOnly ? (
                        "Only Followers Can Mirror"
                      ) : (
                        "Mirror"
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

export default MirrorsModal;
