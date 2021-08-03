export interface IUser {
  name: string;
  picture: string;
  id: string;
  color: string;
}

export interface IScreen {
  width: string;
  height: string;
  screenDirection: string | undefined;
  timestamp: Date;
}

export interface IFrame {
  id: string;
  versionedUrl: string;
  title: string;
  users: Array<IUser>;
  screen: IScreen;
}

export interface ICanvas {
  currentFrame: IFrame;
  allFrames: Array<IFrame>;
  version: number;
}

export interface ICursor extends IUser {
  x: number;
  y: number;
}
