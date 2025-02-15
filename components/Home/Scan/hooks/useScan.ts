import { UseScanResult } from "../types/scan.types";
import { useDispatch, useSelector } from "react-redux";
import { setDial } from "../../../../redux/reducers/dialSlice";
import { setLayout } from "../../../../redux/reducers/layoutSlice";
import { RootState } from "../../../../redux/store";
import { setBackground } from "../../../../redux/reducers/backgroundSlice";
import { FormEvent, useState } from "react";
import {
  searchProfile,
  searchPublication,
  searchPublicationAuth,
} from "../../../../graphql/queries/search";
import lodash from "lodash";
import { setPreSearch } from "../../../../redux/reducers/preSearchSlice";
import { Profile } from "../../../Common/types/lens.types";
import { useRouter } from "next/router";
import { setSearchTarget } from "../../../../redux/reducers/searchTargetSlice";
import callLexicaSearch from "../../../../lib/lens/helpers/callLexicaSearch";
import getPublicationReactions from "../../../../lib/lens/helpers/getPublicationsReactions";
import checkIfFollowerOnly from "../../../../lib/lens/helpers/checkIfFollowerOnly";

const useScan = (): UseScanResult => {
  const dispatch = useDispatch();
  const router = useRouter();
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const backgroundNumber = useSelector(
    (state: RootState) => state.app.backgroundReducer.value
  );
  const searchTarget = useSelector(
    (state: RootState) => state.app.searchTargetReducer.value
  );
  const [profileSearchValues, setProfileSearchValues] = useState<any[]>([]);
  const [imagesScanLoading, setImagesScanLoading] = useState<boolean>(false);
  const [scanSearchTarget, setScanSearchTarget] = useState<string>("");
  const [currentSetting, setCurrentSetting] = useState<number>(0);
  const [dropDown, setDropDown] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [publicationSearchValues, setPublicationSearchValues] = useState<any[]>(
    []
  );

  const [profilePageCursor, setProfilePageCursor] = useState<any>();

  const handleQuickSearch = async (e: FormEvent): Promise<void> => {
    setSearchLoading(true);
    let searchTargetString: string = (e.target as HTMLFormElement).value;
    setScanSearchTarget(searchTargetString);
    // dispatch(setSearchTarget(searchTargetString));
    if (searchTargetString !== "") {
      setDropDown(true);
    } else {
      setDropDown(false);
      setSearchLoading(false);
      return;
    }
    let publications: any;
    try {
      const profiles = await searchProfile({
        query: searchTargetString,
        type: "PROFILE",
        limit: 50,
      });
      if (lensProfile) {
        publications = await searchPublicationAuth({
          query: searchTargetString,
          type: "PUBLICATION",
          sources: "thedial",
          limit: 50,
        });
      } else {
        publications = await searchPublication({
          query: searchTargetString,
          type: "PUBLICATION",
          sources: "thedial",
          limit: 50,
        });
      }
      setProfilePageCursor(profiles?.data?.search?.pageInfo);
      const sortedProfileArr = lodash.sortBy(
        profiles?.data?.search?.items,
        "handle"
      );
      const arr: any[] = [...publications?.data?.search?.items];
      const sortedPublicationArr = arr?.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setProfileSearchValues(sortedProfileArr);
      setPublicationSearchValues(sortedPublicationArr);
    } catch (err: any) {
      console.error(err.message);
    }
    setSearchLoading(false);
  };

  const handleMoreProfileQuickSearch = async (): Promise<void> => {
    setSearchLoading(true);
    try {
      const profiles = await searchProfile({
        query: searchTarget,
        type: "PROFILE",
        limit: 50,
        cursor: profilePageCursor?.next,
      });
      const sortedProfileArr = lodash.sortBy(
        profiles?.data?.search?.items,
        "handle"
      );
      setProfileSearchValues([...profileSearchValues, ...sortedProfileArr]);
      setProfilePageCursor(profiles?.data?.search?.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
    setSearchLoading(false);
  };

  const handleKeyDownEnter = async (e: any): Promise<void> => {
    try {
      setSearchLoading(true);
      if (e.key === "Enter") {
        setDropDown(false);
        router.push(`/#Slider`);
        dispatch(setLayout("Slider"));
        const {
          mixtapeMirrors,
          reactionsFeed,
          hasCommented,
          hasMirrored,
          hasReacted,
        } = await getPublicationReactions(publicationSearchValues, lensProfile);
        const followerOnly = await checkIfFollowerOnly(
          publicationSearchValues,
          lensProfile
        );
        dispatch(
          setPreSearch({
            actionItems: publicationSearchValues,
            actionTarget: e.target?.value,
            actionMixtapeMirrors: mixtapeMirrors,
            actionReactionsFeed: reactionsFeed,
            actionCommented: hasCommented,
            actionMirrored: hasMirrored,
            actionReacted: hasReacted,
            actionFollower: followerOnly,
          })
        );
        if (e.target?.value !== "" || !e.target?.value) {
          dispatch(setSearchTarget(e.target?.value));
          await callLexicaSearch(e.target?.value, dispatch, setImagesScanLoading);
        }
        document.getElementById("sliderSearch")?.scrollIntoView({
          block: "start",
          behavior: "smooth",
        });
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setSearchLoading(false);
  };

  const handleChosenSearch = async (
    type: string,
    user?: Profile
  ): Promise<void> => {
    setDropDown(false);
    setSearchLoading(true);
    try {
      if (type === "profile") {
        router.push(`/profile/${user?.handle.split(".test")[0]}`);
      } else {
        router.push(`/#Slider`);
        dispatch(setLayout("Slider"));
        const {
          mixtapeMirrors,
          reactionsFeed,
          hasCommented,
          hasMirrored,
          hasReacted,
        } = await getPublicationReactions(publicationSearchValues, lensProfile);
        const followerOnly = await checkIfFollowerOnly(
          publicationSearchValues,
          lensProfile
        );
        dispatch(
          setPreSearch({
            actionItems: publicationSearchValues,
            actionTarget: searchTarget,
            actionMixtapeMirrors: mixtapeMirrors,
            actionReactionsFeed: reactionsFeed,
            actionCommented: hasCommented,
            actionMirrored: hasMirrored,
            actionReacted: hasReacted,
            actionFollower: followerOnly,
          })
        );
        await callLexicaSearch(
          scanSearchTarget as string,
          dispatch,
          setImagesScanLoading
        );
        dispatch(setSearchTarget(scanSearchTarget));
        document.getElementById("sliderSearch")?.scrollIntoView({
          block: "start",
          behavior: "smooth",
        });
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setSearchLoading(false);
  };

  const canvasURIs: string[] = [
    "QmQZAsmdnPUdGGhBVqWLLddLLWYF9v3oj1wjVe1S5sSm47",
    "QmaNei1oQ4AmvXgjtLFsYLBb5mwWoibFRsMtKYERSP66kt",
    "Qmct7DFwqJ5RzPCurVCKsJfvNdFp2k4tSHvyGHdw6KbGzi",
    "QmesAAdES6rPEjUeVzfjScv6r63hL7ZTA1km5ERX42anqu",
    "QmWLjgAVShfnjdyNKatkQ4AbdGgnCQjHVbpvsuaEP3QVZk",
  ];

  const mainImage: string[] = [
    "QmcDKJt29aMZeFpHtv61R4TZU1MbBXeb5RzfdoY6Ee2hsY",
    "QmcuNti3wRdtbwmHGXg1S6oExw4mn2DRmK1QqkWrMh97AW",
    "QmRfz2Fp6E93mUuAH5mhYKpeVPJQAQkn7HLKkiSsWwtsd2",
    "QmWsyrjoizyX4GRYeGvJ3ecd7YDMkonDM2KBTW2bHH18VX",
    "QmP2fNq3YQ5RbeZitu8cRc1ajCeW8YbgZmkjV6Nn9VGenT",
    "QmYJ3bkG7b1EHr2sipLRX1NW8Szei8uizSGwohpTbTL5i7",
    "QmfVLPL7WG3QrgJ63bK33uzG5RCAntB734vo8J2JBGSYyr",
    "QmQVwiqRtAaTCFtmssBTghahs83xM2Fgs1F188Dt6pDiSi",
    "QmbfZrJ79XhFTgBTzTb4CaZwM59EgnPuPYMcx7gtazxcdE",
    "QmUECY83LZx8eYsZ4XUNVYMQDF5Cm8iowrVTYi1vpi1Ajo",
    "QmQ4y8wbehLHjhfdp6P9VZQ88ArC7wYYe6wVXs7Di9MTzm",
    "QmUa96CBCsBxSyEgFS6bU9T6yZtpwcTT92LHuBqGAWhYPg",
    "QmQVwiqRtAaTCFtmssBTghahs83xM2Fgs1F188Dt6pDiSi",
    "QmWkJaHuQv9LWUDE4eqDPWx4vdq55Ug5gKhHpBnLP6jex4",
    "QmVQDYFT9A98on8BHdDRNsnXV5e55XTurDYHg52Z6ui7CF",
    "QmYJ3bkG7b1EHr2sipLRX1NW8Szei8uizSGwohpTbTL5i7",
    "Qma8CDZVUg5BHYzeB1PeTephfPUx8MWt7jm71YTAKS5tt3",
    "QmcBV71Rt3DnPUG6JX8a3Y87eio4jnDNbw5mFynNbgzbUK",
    "QmPfYcdeKrqdeaovLHKJfcqa95JJmSWsSH4HTuDajCiCX5",
    "QmWkr4mugAkeMvFDhUcsUdaAWKVYgisx8UjSXnkwGRLRXb",
    "QmR3gNbyDankUaDEtkjWvywy3bx3jHqArRUmcAVKtcermY",
    "QmXqb8FsYbUuw5X2F2FVyN45oHq3FJLe8zPQRcTU3nKfxR",
    "QmNqm2KGjJgHEXCkkRDJFeEW6qfT4AydLhc6Z8YoqY9ci5",
    "QmaBy4D6HF4LqE3tnLoVKd9zP4c7Zb77zH16eP6AKw3jT7",
    "QmW4P4g5YPiCBXX4fm7gYk4M4E59kcdEqiZCsrdyKyDYNd",
    "QmQen3WfHNFDp93mLdAHnaxyGjbTVHPABPKfPpKSk2jhHa",
    "QmQw5uTVUYBH3JB6C4KFaWw8LqvvdFNJngm6cD6VuYChDc",
    "Qmc6CZNLhK63oSps2ENoJ3DDM7aMHPaoMVmVMmfQqs7g5A",
    "QmSEXQdgbu7jvhAPkwwzAysvvuECdE8HFwRQKn9wohqU2v",
    "QmctDwzVrqefZhGYhSk2zV2VZP3CzSxfQ3wmyCgnPwaRCh",
    "Qmaq7ZPiyGMrwqWfiBL3Ptfp2Ts5y4SiDw11mopqYCxQTH",
    "QmYvHs8P2VMUhrMb1gyNHJQcUNH9KxffHDCz8XKCStibg2",
    "QmfA1nj3zLdLJgEQibD94GrHs3cUq5AHFQipsD5M8c4h1n",
    "QmW3ug13HzGcw41ZmyCGzcDWKuqS6jzJjDoSrsmXkHpfgw",
    "QmckXz2zRUUVLfh5LYDt4Hi169Nh3GwRTRJxGEDw1bhWRD",
    "QmbFSh25XPfQ6uQjRhviTB9yN6GKAj5U47qUN37xgkebHd",
    "QmTsCMGgvFng72wQVQiwTATZKkYeTXDdRZ3UFJwXmsXRzd",
    "QmbGpt7vCEoUgwX8SnUPx6gM7hV7BUJhZvzK71Mocx85Qq",
    "QmRKAH6bwXPVns4JwSahsCaCRa9GhUxpNUkgMNxcc3apWs",
    "QmdkdTcstEBizD7VZsFrutnkRm9UHBi5knVyfhQtqJgohd",
    "QmWkorB41T6WPJjMQ9RwdgXgsThP1NWR9DqjixKQ6knb5f",
    "QmTrNdRxVaZ8CMBAiAaUHFrgGgq4iaVo8rxX7UkMxKKLqe",
    "QmNf3YWPHHc18uUpEVhZPxa5CweXpABTV6XcBGBpwMUQ8R",
    "QmcBV71Rt3DnPUG6JX8a3Y87eio4jnDNbw5mFynNbgzbUK",
    "QmUa96CBCsBxSyEgFS6bU9T6yZtpwcTT92LHuBqGAWhYPg",
    "QmUeuM2GdkfQmGtTy5zJ2PFTMNj6Kh3A4PruuXkTTbFUGG",
    "QmXTE1yHUs6geX3Y1QDaTLk1jLbm9Vyx7y3xAB9ox8j13j",
    "QmQeYKz6SUAiPb3pGdbUg4uK9UYhLHwS1RZrg91jvrBMq2",
    "QmZT3PtRxSNt3LmXnWB5eECSovoUndAgzgTKjaCXNyk8vX",
    "QmemMvPmXD6DyiRbwFTyg4LHMHhF7SLkSgX5tqaXmFwqCs",
    "QmWM6aEpVWnwMwUcPJKKEWnj1deNq1H934y9sHz7SQsh6U",
    "QmRKBiZ9idW6dmQCMQnLbsaRJBAiYysKJhF5xz4LX3dXMt",
    "QmdmQNGLjyfJuCrHVsK9xrck7E9mEfm6oprp1dtxbNhr3K",
    "QmT6RpQZ4Sdv135sz1CQBy1dm4XtWJzXeGFPo9p1PvxHdx",
    "QmcwCAacJT6WzcyUEP4HngCqTXVogGPP4cFDpw5NMcBATt",
    "QmWRnieLeHfC3jQkuXZ4z2Z1DHfKsThCaReUGkcp3GGU6b",
    "QmeodnXaSi9jXczczcN4i5a9VEp5fDowVGBJtRHvy1hHRD",
    "QmdiKR4AMy69VBbur9McfTvGAaw7SwU11NiKpNS9RQZ1sF",
    "QmTPoECBmvRHG31ntnE9wnvX4rw4eJZeaRFzKW1xtHgeAZ",
    "Qma2YEkLWnMTr5uUARDoaM96EkCwzyhJ1vTCXhjFPMGVL5",
    "QmZ4uFpbnjR4z7BbivbbieWz6QQqGt5zK6JUe92uw7nygn",
    "QmY5WPMencscnU4Gqbd9deDfy3aenQAUvrjhd3Njns96gH",
    "QmXMtv2sTvR56nznxZW4t3fkona5ppJdwwRmAt2dcPCpyt",
    "QmTkkPxZFttDrPtsHViWReGc7avPq3GN3erGQet7mxHBXn",
    "QmRMRtQshiby87ECX7Ktvyyz9toX12aHMtYUhUS5qJTZN9",
    "Qmb3eWA9cT1VTfpM6QG4bYCeGziCzA7A3NeU3CqLAAYiwQ",
    "QmTeyvsFPW7GUkUSPWzrT7kBGLrp6ANPnmE9RmzK5VkGT3",
    "QmYwCMdsedbZ3SRtCCEqUYBJn2Lcdf2vABQhm7ScxUoUHd",
    "QmUzVntqTNoV4TKTvzTp7D6SG62oU9SehZmCmeukaRjceS",
    "QmTVMXcjyMNmkMiyUFKxx3iqqdCTMuSpnLCgUS6usLX9Bu",
    "QmNwn2k2XFqs1aw6zBFS2n82pbFeHy6G59oTzwaM1FYM6a",
    "QmUVL7BRGpbZUMKsmKxshwzS88d6FgssLpvoiUda7NqPwr",
    "QmP1f9jSctxnRKwMaLP3LKFo23VQFoxjemrnjhAmNaaGZN",
    "QmRyvBxEHQL8CLmUKRehGLUvP6DcCMRzEgZZ9PZiGH7wYE",
    "QmXfjyZLfvHyB6nHWBnmbnq7spRREvui9RzNtfp7Wyjsej",
    "QmNvDugwUQ6BQTdSD6AXGNJBmomUxibxG7dKz1QTCtqK9D",
    "QmQh4Dubk6S6hC2KKTdLxj67sepa6ZDin8Qh6HRshgvj2E",
    "QmbgS1g7EcaXMEXa8T4xaGTudhzQsteTxGVZUEpiXzovG8",
    "Qma3QtAizcmW2JjBRLGWHZA16oGPPFwhCvKoVyfvyepdfN",
    "QmbpRBzg48MJH8bS6zyeFEC4713FDfqNNXjSvXvW1b5JKH",
    "QmQwHMwXuHnchqM6Y3ZSKuC88JytgmhUz1hNHkCoAwTcMq",
    "QmZZAAe2XnTt7E3cQoUjsLrS72WrhUe4SG83zMTnxTSrpT",
    "QmSBqLbq8VAMM7Ww8xTsENtpEQRY9KPei128tg7LHutsJF",
    "QmYVWMk7eDG2QJHPyjr5hTkYaWgfA3Bb5EDNmYH4FUAp8a",
    "QmdBLqv5wDxfd9fgREYCvpygA3bHLskB1cmDueFN9WhVYh",
    "QmNpShvT7kmhGRanfSS6CaNH4E7HWxL9s5gAjzs7bFZ153",
  ];

  const imageTitle: string[] = [
    "INFINITE RECORDS",
    "WHY STOP AT AI SELFIES?",
    "AUTOCOMPLETE FOR EVERYTHING",
    "SURF THE LATENT WAVES",
    "EVOLVE FUTURE NOSTALGIA",
  ];

  const imageArtist: string[] = [
    "EVERY PUBLIC MESSAGE A SAVED MEMORY",
    "START WITH DRAFTS TO TRAIN YOUR OWN MODELS",
    "IT’S A LOT MORE THAN 140 CHARACTERS OR LESS",
    "NEW TAKES ON 24/7 LO-FI MIXTAPES",
    "SHRINK THE DISTANCE BETWEEN THEN AND NOW",
  ];

  const imageDescription: string[] = [
    "That’s all art is. Showing yourself to the world, hoping someone else understands, and knowing it won’t be lost when Elon unplugs the bird. Because this time it’s all user owned.",
    "Now that you’ve been tempted, like everyone else on the old mobile instant influencer apps, to upload a few selfies and see how good AI can make you look… don’t you want to take it somewhere a bit more interesting?",
    "With text-to-image, text-to-text, text-to-textiles, and everything always coming along a step or two faster than we can expect, we’ve built a lightweight canvas to replace the old and outdated text box. Bet you didn’t know you’d love it so.",
    "Attention, attention, fellow AI spellslingers. Are you tired of the old same / same social feeds? Then listen up, because there’s always something special on the dial for all you creative rebels out there. Ditch the mainstream commentariat. Stay free, stay wild, and we’ll see you on the other side of the wall.",
    "What’s it like in a year or two, looking back to when it all felt new? Let’s skip the chit chat and test it live right here: “The insatiable need for more processing power, ideally located as close as possible to the user, but at the very least in nearby industrial server farms, invariably leads to a third option. Decentralized computing.” [src] Take that as your prompt. Will it be theft in the inspiration, or new art in the remix? Let’s evolve together & find out.",
  ];

  const dialSettings: string[] = [
    "Scanner",
    "Highlights",
    "Drops",
    "Reach",
    "Records",
  ];

  const handleCount = (): void => {
    dispatch(setDial(dialSettings[currentSetting]));
    router.push(`/#Slider`);
    dispatch(setLayout("Slider"));
    if (backgroundNumber < 4) {
      dispatch(setBackground(backgroundNumber + 1));
      setCurrentSetting(currentSetting + 1);
    } else if (backgroundNumber === 4) {
      dispatch(setBackground(0));
      setCurrentSetting(0);
    } else if (backgroundNumber > 4) {
      setCurrentSetting(0);
      dispatch(setBackground(0));
      dispatch(setDial(dialSettings[0]));
    }
  };

  return {
    currentSetting,
    handleCount,
    canvasURIs,
    mainImage,
    imageTitle,
    imageArtist,
    imageDescription,
    handleQuickSearch,
    publicationSearchValues,
    profileSearchValues,
    handleMoreProfileQuickSearch,
    searchLoading,
    dropDown,
    handleChosenSearch,
    handleKeyDownEnter,
    scanSearchTarget,
    imagesScanLoading
  };
};

export default useScan;
