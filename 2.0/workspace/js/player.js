const { of, zip, mergeMap, BehaviorSubject, from, tap, filter } = rxjs;

const observeStream = (sessionId) => {
  const propagateId = (id) => zip(from(fetchEvents(sessionId, id)), of(id));

  const load$ = new BehaviorSubject("$");

  return load$.pipe(
    mergeMap((id) => propagateId(id)),

    tap(([data, prev_id]) => {
      const id = data ? data.id : prev_id;
      load$.next(`${id}`);
    }),

    filter(([data]) => data !== null)
  );
};

const fetchEvents = (sessionId, lastId) => {
  return fetch(`http://localhost:3000/activity/${sessionId}?from=${lastId}`)
    .then((response) => response.json())
    .then((events) => events)
    .catch((error) => null);
};

function initialize() {
  console.log("initialized player");
  var replayer;
  let isSetup = true;
  let startedStreaming = false;
  observeStream("54676244495769780").subscribe(([data]) => {
    if (data && data.events.length > 0) {
      if (isSetup) {
        console.log("setting up");
        // const lastPacket = rrweb.unpack(data.events[0]);
        replayer = new Player({
          target: document.getElementById("player"),
          props: {
            events: data.events,
            liveMode: true,
            skipInactive: false,
            // showController: false,
            width: 1200,
            height: 764,
            unpackFn: rrweb.unpack,
          },
        });
        console.log("initial count: ", data.events.length);
        // data.events.forEach((event) => {
        //   replayer.addEvent(event);
        // });
        isSetup = false;
      } else {
        console.log("count ", data.events.length);
        // if (!startedStreaming) {
        //   const lastPacket = rrweb.unpack(data.events[data.events.length - 1]);
        //   replayer.getReplayer().startLive(new Date().getTime() - 1000);
        //   console.log("started streaming");
        //   // console.log(new Date().getTime(), lastPacket.timestamp);
        //   startedStreaming = true;
        // }
        if (!startedStreaming) {
          const lastPacket = rrweb.unpack(data.events[data.events.length - 1]);
          const now = new Date();
          console.log("now :", now);
          console.log("event time :", new Date(lastPacket.timestamp));
          // if (now.getTime() - lastPacket.timestamp <= 1000) {
          console.log("started streaming");
          replayer.getReplayer().startLive();
          startedStreaming = true;
          // }
        }
        data.events.forEach((event) => {
          replayer.addEvent(event);
        });
      }
    }
    //what all do we want to do here?
    //Parse all the events
  });
  // ipc.on("liquid", (event, request) => {
  //   liquid.onManagmentMessage(request);
  //   console.log("liq listener: ", request);
  // });
}

module.exports = { initialize };
