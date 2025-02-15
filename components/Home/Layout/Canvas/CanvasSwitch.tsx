import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { setSignIn } from "../../../../redux/reducers/signInSlice";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Draw from "./modules/Draw";
import useDraw from "./hooks/useDraw";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/lens/constants";
import useBase from "./hooks/useBase";
import useDrafts from "./hooks/useDrafts";

const CanvasSwitch: FunctionComponent = (): JSX.Element => {
  const profile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const isConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const dispatch = useDispatch();
  const { openConnectModal } = useConnectModal();
  const {
    hex,
    setHex,
    showSideDrawOptions,
    setShowSideDrawOptions,
    canvasRef,
    brushWidth,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    showBottomDrawOptions,
    setShowBottomDrawOptions,
    colorPicker,
    setColorPicker,
    tool,
    setShapeFillType,
    setThickness,
    thickness,
    setBrushWidth,
    handleSave,
    setDraftBoard,
    draftBoard,
    handleImageAdd,
    setTool,
    shapes,
    setShapes,
    undo,
    redo,
    selectedElement,
    action,
    writingRef,
    handleBlur,
    handleClear,
    handleCanvasPost,
    postLoading,
    handleTitle,
    title,
    handleCanvasSave,
    saveLoading,
    zoom,
    setZoom,
    setNewCanvas,
    addImageToCanvas,
  } = useDraw();
  const {
    quickSearchResults,
    searchLoading,
    handleChangeSearch,
    searchTarget,
    handleKeyEnter,
    fillImages,
  } = useBase();
  const { draftsLoading, loadDraft } = useDrafts();
  let actionValue: string = "canvas";
  const decideStringAction = () => {
    if (!profile || !isConnected) {
      actionValue = "no profile";
    }
    return actionValue;
  };

  switch (decideStringAction()) {
    case "no profile":
      return (
        <div
          className="relative w-full h-[70vw] grid grid-flow-col auto-cols-auto bg-offBlack rounded-lg border border-white grid grid-flow-col auto-cols-auto text-white font-dosis"
          onClick={
            !isConnected ? openConnectModal : () => dispatch(setSignIn(true))
          }
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmdCN3qFCJcao9HfQVbQm3SbCjErMJysefqgP1uogXjtve`}
            objectFit="cover"
            layout="fill"
            className="absolute rounded-lg"
          />
          <div className="relative w-fit h-fit place-self-center">
            Please Connect to Lens to use the Canvas.
          </div>
        </div>
      );

    default:
      return (
        <Draw
          hex={hex}
          setHex={setHex}
          showSideDrawOptions={showSideDrawOptions}
          setShowSideDrawOptions={setShowSideDrawOptions}
          canvasRef={canvasRef}
          brushWidth={brushWidth}
          handleMouseDown={handleMouseDown}
          handleMouseUp={handleMouseUp}
          handleMouseMove={handleMouseMove}
          showBottomDrawOptions={showBottomDrawOptions}
          setShowBottomDrawOptions={setShowBottomDrawOptions}
          colorPicker={colorPicker}
          setColorPicker={setColorPicker}
          setShapeFillType={setShapeFillType}
          setThickness={setThickness}
          thickness={thickness}
          setBrushWidth={setBrushWidth}
          handleKeyEnter={handleKeyEnter}
          handleChangeSearch={handleChangeSearch}
          searchLoading={searchLoading}
          searchTarget={searchTarget}
          quickSearchResults={quickSearchResults}
          fillImages={fillImages}
          setTool={setTool}
          handleSave={handleSave}
          draftBoard={draftBoard}
          setDraftBoard={setDraftBoard}
          handleImageAdd={handleImageAdd}
          tool={tool}
          shapes={shapes}
          setShapes={setShapes}
          undo={undo}
          redo={redo}
          selectedElement={selectedElement}
          action={action}
          writingRef={writingRef}
          handleBlur={handleBlur}
          handleClear={handleClear}
          handleCanvasPost={handleCanvasPost}
          postLoading={postLoading}
          title={title as string}
          handleTitle={handleTitle}
          handleCanvasSave={handleCanvasSave}
          saveLoading={saveLoading}
          zoom={zoom}
          setZoom={setZoom}
          addImageToCanvas={addImageToCanvas}
          draftsLoading={draftsLoading}
          loadDraft={loadDraft}
          setNewCanvas={setNewCanvas}
        />
      );
  }
};

export default CanvasSwitch;
