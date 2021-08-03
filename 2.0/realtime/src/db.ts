import Redis from "ioredis";
import * as crypto from "crypto";
const dbClient = new Redis();

interface IUser {
  id: string;
  name: string;
  picture: string;
  color: string;
}

export const getRoom = async (id: string, frameId: string) => {
  console.log("room id: ", id);
  const value = await dbClient.get(id);
  const room = JSON.parse(value);

  const frames = room.panes.map(
    (pane: { url: string; name: string }) =>
      `FRAME:${crypto.createHash("sha256").update(pane.url).digest("hex")}`
  );

  const usersGroupedByFrames = await getUsersInFrames(frames);
  const allFrames = usersGroupedByFrames.map((f, index) => {
    return {
      id: f.id,
      versionedUrl: room.panes[index].url,
      title: room.panes[index].title,
      users: f.users,
      screen: {
        width: 1200,
        height: 800,
        timestamp: new Date(),
      },
    };
  });
  return {
    currentFrame: allFrames.find((frame) => frame.id === frameId),
    allFrames,
  };
};

export const joinFrame = async (
  id: string,
  user: IUser
): Promise<Array<IUser>> => {
  const value = await dbClient.get(id);
  let frame: { [key: string]: IUser } | undefined;
  if (value) {
    frame = JSON.parse(value);
    frame[user.id] = user;
  } else {
    frame = { [user.id]: user };
  }
  await dbClient.set(id, JSON.stringify(frame));
  const users = await getUsersInFrame(id);
  return users;
};

export const leaveFrame = async (
  id: string,
  userId: string
): Promise<Array<IUser>> => {
  const value = await dbClient.get(id);
  let frame: { [key: string]: IUser } | undefined;
  if (!value) {
    return;
  }
  frame = JSON.parse(value);
  frame[userId] = undefined;
  await dbClient.set(id, JSON.stringify(frame));
  const users = await getUsersInFrame(id);
  return users;
};

const getUsersInFrame = async (id: string): Promise<Array<IUser>> => {
  const value = await dbClient.get(id);
  const users = JSON.parse(value);
  return Object.values(users);
};

export const getUsersInFrames = async (frames: Array<string>) => {
  let values = await dbClient.mget(...frames);
  const usersGroupedByFrames = values.map((value, index) => {
    return {
      id: frames[index],
      users: Object.values(JSON.parse(value)),
    };
  });
  return usersGroupedByFrames;
};
