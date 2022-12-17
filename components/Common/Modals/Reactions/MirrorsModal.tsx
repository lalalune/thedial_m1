import Image from "next/legacy/image";
import Link from "next/link";
import React, { FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { INFURA_GATEWAY } from "../../../../lib/lens/constants";
import { setReactionState } from "../../../../redux/reducers/reactionStateSlice";
import { RootState } from "../../../../redux/store";
import { MirrorsModalProps } from "../../types/common.types";

const MirrorsModal: FunctionComponent<MirrorsModalProps> = ({
  mirrorers,
  getMorePostMirrors,
  mirrorPost,
  mirrorLoading,
  mirrorComplete
}): JSX.Element | null => {
  const dispatch = useDispatch();
  const pubId = useSelector((state: RootState) => state.app.reactionStateReducer.value)
  return (
    <div className="inset-0 justify-center fixed z-30 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[40vw] h-fit col-start-1 place-self-center bg-offBlue/70 rounded-lg p-2">
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
                  })
                )
              }
            >
              <ImCross color="black" size={15} />
            </div>
            {mirrorers.length > 0 ? (
              <div className="relative w-full h-fit row-start-2 grid grid-flow-row auto-rows-auto">
                <InfiniteScroll
                  hasMore={true}
                  dataLength={mirrorers.length}
                  next={getMorePostMirrors}
                  loader={""}
                  height={"10rem"}
                  className="relative w-full h-fit row-start-1 grid grid-flow-row auto-rows-auto px-4"
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
                        profileImage = (mirrorer?.picture as any)?.original.url;
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
                      <Link
                        href={`/profile/${mirrorer.handle.split("lens")[0]}`}
                        key={index}
                        className="relative w-full h-fit p-2 drop-shadow-lg grid grid-flow-col bg-gray-50 auto-cols-auto rounded-lg border border-gray-50"
                      >
                        <div className="relative w-fit h-fit grid grid-flow-col auto-cols-auto col-start-1 gap-6">
                          <div className="relative w-8 h-8 rounded-full bg-offBlue col-start-1">
                            <Image
                              src={profileImage}
                              objectFit="cover"
                              layout="fill"
                              alt="pfp"
                              className="relative w-fit h-fit rounded-full self-center"
                            />
                          </div>
                          <div
                            id="handle"
                            className="relative w-fit h-fit place-self-center col-start-2"
                          >
                            @{mirrorer?.handle}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </InfiniteScroll>
                <div className="relative w-fit h-fit row-start-2 grid grid-flow-row auto-rows-auto font-dosis text-black text-center gap-3 place-self-center">
                  <div className="relative w-fit h-fit row-start-1 place-self-center p-3">
                    Mirror this post?
                  </div>
                  <div
                    className="relative w-20 h-10 rounded-md bg-offBlue grid grid-flow-col auto-cols-auto text-white font-dosis text-sm place-self-center cursor-pointer hover:opacity-70 active:scale-95"
                    onClick={() => mirrorPost()}
                  >
                    <div
                      className={`relative w-fit h-fit col-start-1 place-self-center ${
                        mirrorLoading && "animate-spin"
                      }`}
                    >
                      {mirrorLoading ? (
                        <AiOutlineLoading color="white" size={20} />
                      ) : (
                        "Mirror"
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-fit row-start-2 grid grid-flow-row auto-rows-auto font-dosis text-black text-center gap-3">
                <div className="relative w-fit h-fit row-start-1 place-self-center p-3">
                  This post hasn&apos;t been mirrored. Will you be first?
                </div>
                <div
                  className="relative w-20 h-10 rounded-md bg-offBlue grid grid-flow-col auto-cols-auto text-white font-dosis text-sm place-self-center cursor-pointer hover:opacity-70 active:scale-95"
                  onClick={() => mirrorPost()}
                >
                  <div
                    className={`relative w-fit h-fit col-start-1 place-self-center ${
                      mirrorLoading && "animate-spin"
                    }`}
                  >
                    {mirrorLoading ? (
                      <AiOutlineLoading color="white" size={20} />
                    ) : (
                      "Mirror"
                    )}
                  </div>
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
