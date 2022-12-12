import { Dispatch, AnyAction } from "redux";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { BadgeInfo } from "../../Home/Badges/types/badges.types";

export type ReactionProps = {
  textColor: string;
  commentColor: string;
  mirrorColor: string;
  collectColor: string;
  heartColor: string;
};

export type InterfaceProps = {
  title: string;
  tapeTitles: string[];
  handleTapeSet: (title: string) => void;
  images?: string[];
  message?: Message;
  backgroundImages?: string[];
  sideImage?: string;
  mixtape?: boolean;
};

export type BoxProps = {
  image: string;
  row: string;
  col: string;
  self: string;
  justify: string;
};

export type BadgeProps = {
  index: number;
  badgeInfo: BadgeInfo;
};

export type RewindProps = {
  row: string;
  scale?: string;
  limitValue?: number;
  currentValue?: number;
  handleValueChange?: (e: number) => void;
};

export type TopicProps = {
  index: number;
  dispatch: Dispatch<AnyAction>;
  setTopic: ActionCreatorWithPayload<string, "topic/setTopic">;
  topic: string;
  selectedTopic: string;
};

export type TopicValuesProps = {
  index: number;
  value: string;
};

export type PanelOptionProps = {
  index: number;
  dispatch: Dispatch<AnyAction>;
  layoutType: string[];
  setLayout: ActionCreatorWithPayload<string, "layout/setLayout">;
  uri: string;
};

export type ArrowProps = {
  handleValue?: (e: boolean) => void;
  value?: boolean;
  up: string;
  middle: string;
  down: string;
  vertical?: boolean;
};

export type PresetProps = {
  index: number;
  format: string;
};

export type FeedPublicationProps = {
  images: string[];
  row: string;
};

export type OptionMenuProps = {
  col?: string;
  image: string;
  handleOpenDropdown: (e: boolean) => void;
  openDropdown: boolean;
  bgColor: string;
  values: string[];
  dispatch: Dispatch<AnyAction>;
  dispatchFunction: any;
  selectorValue: string | undefined;
  imageWidth: number;
  imageHeight: number;
};

export type LineProps = {
  col: string;
  width: string;
};

export type PanelProps = {
  col: string;
};

export type TapeProps = {
  bgColor: string;
  backgroundImages?: string[];
  sideImage?: string;
  title?: string;
  locked?: boolean;
  mixtape?: boolean;
  index: number;
  handleTapeSet?: (title: string) => void;
};

export type MainDisplayProps = {
  row: string;
  title: string;
  mixtape?: boolean;
  tapeTitles: string[];
  handleTapeSet: (title: string) => void;
  images?: string[];
  message?: Message;
  backgroundImages?: string[];
  sideImage?: string;
};

export type ButtonIconProps = {
  width: string;
  height: string;
  image?: string;
  col: string;
  justify: string;
  self: string;
};

export type NotificationSliderProps = {
  images?: string[];
};

export type NotificationBarProps = {
  images?: string[];
  message?: Message;
};

export interface Message {
  title: string;
  paragraph: string;
}

export type NotificationMessageProps = {
  message?: Message;
};

export type MixSaveProps = {
  col: string;
};

export type MixButtonProps = {
  col: string;
  bgColor: string;
  text: string;
  textSize: string;
  width: string;
  border?: boolean;
};

export type MixInputProps = {
  row: string;
  name: string;
  title: string;
};

export type MixCheckProps = {
  value: string;
  handleClicked: (valueClicked: boolean, value: string) => void;
  valueClicked: boolean;
};

export type UseCreateMixtapeResults = {
  checkValues: string[];
  handleClicked: (valueClicked: boolean, value: string) => void;
  valueClicked: boolean;
};

export type CreateMixtapeProps = {
  checkValues: string[];
  handleClicked: (valueClicked: boolean, value: string) => void;
  valueClicked: boolean;
  dispatch: Dispatch<AnyAction>;
  setAddTrack: ActionCreatorWithPayload<number, "add track/setAddTrack">;
  setEditTrack: ActionCreatorWithPayload<string, "edit track/setEditTrack">;
  setDeleteTrack: ActionCreatorWithPayload<
    string,
    "delete track/setDeleteTrack"
  >;
  setAddMixtape: ActionCreatorWithPayload<string, "add mixtape/setAddMixtape">;
  trackNumber: number | undefined;
};

export type TrackInputProps = {
  index: number;
};

export type RecordProps = {
  index: number;
  recordImage: string;
};

export type useLensSignInResults = {
  handleLensLogin: () => Promise<void>;
  profileState: string;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
};

export type LensSignInProps = {
  handleAction?: () => any;
  isLoading?: boolean;
};

export type AuthSwitchProps = {
  isConnected: boolean;
  profileState: string;
}