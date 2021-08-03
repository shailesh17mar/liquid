const roomId = "default";
const liquidListener = (request, sendResponse) => {
  const messageType = request.message.toUpperCase();
  switch (messageType) {
    case "INIT_LIQUID":
      sendResponse({
        roomId,
        user: Auth.getUser(),
      });
      break;
    case "LOGIN":
      Auth.authenticate(sendResponse);
      break;
    case "LOGOUT":
      Auth.userSignedIn = false;
      sendResponse("success");
      break;
    case "IS_LOGGED_IN":
      sendResponse(Auth.userSignedIn);
      break;
    case "SYNC_SCREENS":
      // startRealtimeCollab(request.frameUrl, request.roomId);
      break;
    case "FETCH_SESSIONS":
      fetchSessions(sendResponse);
      break;
    case "START_SESSION":
      startSession(request.payload, Auth.getUser(), sendResponse);
      break;
    case "RECORD_SESSION":
      recordSession(request.payload, sendResponse);
      break;
    // case 'STOP_SESSION':
    //   stopSession();
    //   break;
    // case 'JOIN_SESSION':
    //   joinSession();
    //   break;
    default:
      throw new Error("Invalid message");
  }
  return true;
};

module.exports = { liquidListener };
