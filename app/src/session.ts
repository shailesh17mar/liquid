import {UserInfo} from './auth';

export const startSession = async (
  sessionDetails: any,
  user: UserInfo,
  sendResponse: Function
) => {
  const createSessionDTO = {
    ...sessionDetails,
    userId: user.sub,
  };
  const response = await fetch('http://localhost:3000/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createSessionDTO),
  });
  const session = await response.json();
  return sendResponse(session);
};

export const recordSession = async (payload: any, sendResponse: Function) => {
  const response = await fetch('http://localhost:3000/session/hello', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return sendResponse(true);
};

export const fetchSessions = async (url: string, sendResponse: Function) => {
  const response = await fetch(`http://localhost:3000/session?url=${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const sessions = await response.json();
  return sendResponse(sessions);
};

// export const stopSession = () => {};
// export const joinSession = () => {};
