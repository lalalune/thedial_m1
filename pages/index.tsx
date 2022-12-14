import type { NextPage } from "next";
import Head from "next/head";
import PublicationModal from "../components/Common/Modals/Publication/PublicationModal";
import LayoutSwitch from "../components/Home/LayoutSwitch/LayoutSwitch";
import Scan from "../components/Home/Scan/Scan";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect, useState } from "react";
import shuffle from "shuffle-array";
import SignInModal from "../components/Common/Modals/SignIn/SignInModal";
import GetProfileModal from "../components/Common/Modals/GetProfile/GetProfileModal";
import ImageViewerModal from "../components/Common/Modals/ImageViewer/ImageViewer";

const Home: NextPage = (): JSX.Element => {
  const makePublication = useSelector(
    (state: RootState) => state.app.publicationReducer.value
  );
  const signInModal = useSelector(
    (state: RootState) => state.app.signInReducer.value
  );
  const getProfileModal = useSelector(
    (state: RootState) => state.app.getProfileModalReducer.value
  );
  const imageViewerModal = useSelector(
    (state: RootState) => state.app.imageViewerReducer.open
  );
  const streamLinks: string[] = [
    "https://www.youtube.com/embed/2Sa8o39R0jY?controls=0?rel=0&autoplay=1&mute=1",
    "https://www.youtube.com/embed/qaoyC8D5Kt0?controls=0?rel=0&autoplay=1&mute=1",
  ];
  const [newLink, setNewLink] = useState<string>(
    "https://www.youtube.com/embed/2Sa8o39R0jY?controls=0?rel=0&autoplay=1&mute=1"
  );
  useEffect(() => {
    const shuffledLinks: number[] = shuffle([0, 1]);
    setNewLink(streamLinks[shuffledLinks[0]]);
  }, []);
  return (
    <div className="relative w-full h-full grid grid-flow-col auto-cols-auto">
      <Head>
        <title>The Dial</title>
        <meta
          name="description"
          content="An ever evolving canvas you can use with friends."
        />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:site_name" content="The Dial" />
        <meta property="og:image" content="https://thedial.xyz/card.png/" />
        <meta property="og:type" content="website" />
      </Head>
      <Scan newLink={newLink} />
      <LayoutSwitch />
      {makePublication && <PublicationModal />}
      {signInModal && <SignInModal />}
      {getProfileModal && <GetProfileModal />}
      {imageViewerModal && <ImageViewerModal />}
    </div>
  );
};

export default Home;
