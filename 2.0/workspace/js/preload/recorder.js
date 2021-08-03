let webviewId;
let isFirstEvent = true;
rrweb.record({
  emit(event, isCheckout) {
    // isCheckout is a flag to tell you the events has been checkout
    if (isFirstEvent) {
      isCheckout = true;
      isFirstEvent = false;
    }
    if (!webviewId) webviewId = window.localStorage.webviewId;
    ipc.send("liquid", {
      message: "RECORD_SESSION",
      payload: {
        sessionId: webviewId,
        event,
        isCheckout,
      },
    });
  },
  // sampling: {
  //   mousemove: false,
  // },
  packFn: rrweb.pack,
  checkoutEveryNth: 400, // checkout every 200 events
});
