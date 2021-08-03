const startSession = async (sessionDetails, user, sendResponse) => {
  const createSessionDTO = Object.assign(Object.assign({}, sessionDetails), {
    userId: user.sub,
  });
  const response = await fetch("http://localhost:3000/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createSessionDTO),
  });
  const session = await response.json();
  return sendResponse(session);
};

const recordSession = async (payload, sendResponse) => {
  const response = await fetch("http://localhost:3000/activity", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return sendResponse(true);
};

const fetchSessions = async (sendResponse) => {
  const response = await fetch(`http://localhost:3000/session`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const sessions = await response.json();
  console.log(sessions);
  return sendResponse(sessions);
};

module.exports = { recordSession, fetchSessions, startSession };
