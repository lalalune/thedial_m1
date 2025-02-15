import { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import callLexicaSearch from "../../../../lib/lens/helpers/callLexicaSearch";
import handleHidePost from "../../../../lib/lens/helpers/handleHidePost";
import { RootState } from "../../../../redux/store";
import Rewind from "../../../Common/Miscellaneous/Rewind/Rewind";
import useSlider from "./hooks/useSlider";
import Presets from "./modules/Presets/Presets";
import PublicationsFound from "./modules/PublicationsFound/PublicationsFound";
import Samples from "./modules/Samples/Samples";
import useSliderSearch from "./modules/SliderSearch/hooks/useSliderSearch";
import SliderSearch from "./modules/SliderSearch/SliderSearch";
import SliderSwitch from "./SliderSwitch";
import shuffle from "shuffle-array";
import { useRouter } from "next/router";
import useScan from "../../Scan/hooks/useScan";
import { useMediaQuery } from "@material-ui/core";

const Slider: FunctionComponent = (): JSX.Element => {
  const { handleBackward, handleForward, currentValue, promptString } =
    useSlider();
  const searchTarget = useSelector(
    (state: RootState) => state.app.searchTargetReducer.value
  );
  const dispatch = useDispatch();
  const { imagesScanLoading } = useScan();
  const {
    handleKeyEnter,
    handleChangeSearch,
    searchLoading,
    dropDown,
    handleChosenSearch,
    publicationsSearchNotDispatch,
    prompts,
    setImagesLoading,
    imagesLoading,
  } = useSliderSearch();
  const publicationsSearch = useSelector(
    (state: RootState) => state.app.preSearchReducer
  );
  const router = useRouter();
  useEffect(() => {
    if (
      (!searchTarget || searchTarget === "") &&
      router.asPath.includes("Slider")
    ) {
      const shuffledLinks: number[] = shuffle([0, 1, 2, 3]);
      callLexicaSearch(
        promptString[shuffledLinks[0]],
        dispatch,
        setImagesLoading
      );
    }
  }, [router.asPath]);

  let queryWindowSize500: boolean = useMediaQuery("(max-width:500px)");

  return (
    <div className="relative w-full h-full row-start-2 grid grid-flow-row auto-rows-auto bg-white py-3 pl-3 md:py-10 md:pl-10 gap-10">
      <SliderSearch
        handleChangeSearch={handleChangeSearch}
        handleKeyEnter={handleKeyEnter}
        searchTarget={searchTarget}
        dropDown={dropDown}
        handleChosenSearch={handleChosenSearch}
        searchLoading={searchLoading}
        prompts={prompts}
        publicationsSearchNotDispatch={publicationsSearchNotDispatch}
      />
      {publicationsSearch?.items && publicationsSearch?.items?.length > 0 && (
        <PublicationsFound
          publicationsSearch={publicationsSearch?.items}
          dispatch={dispatch}
          hasMirrored={publicationsSearch?.mirrored}
          hasReacted={publicationsSearch?.reacted}
          reactionsFeed={publicationsSearch?.reactionsFeed}
          hasCommented={publicationsSearch?.commented}
          mixtapeMirror={publicationsSearch?.mixtapeMirrors}
          handleHidePost={handleHidePost}
          followerOnly={publicationsSearch?.follower}
        />
      )}
      <Samples />
      <div className="relative w-full h-full row-start-4 grid grid-flow-col auto-cols-auto gap-4">
        <div className="relative w-fit h-full col-start-1 grid grid-flow-row auto-rows-auto gap-8 fo:col-span-1 fo:justify-self-start justify-self-center">
          <Rewind
            row={queryWindowSize500 ? "2" : "1"}
            scale={queryWindowSize500 ? "-1" : "1"}
            handleValueChange={
              queryWindowSize500 ? handleBackward : handleForward
            }
            limitValue={queryWindowSize500 ? 0 : 4}
            currentValue={currentValue}
          />
          <Rewind
            row={"2"}
            handleValueChange={
              queryWindowSize500 ? handleForward : handleBackward
            }
            limitValue={queryWindowSize500 ? 4 : 0}
            currentValue={currentValue}
          />
        </div>
        <SliderSwitch
          imagesLoading={imagesLoading}
          imagesScanLoading={imagesScanLoading}
        />
      </div>
      <Presets />
    </div>
  );
};

export default Slider;
