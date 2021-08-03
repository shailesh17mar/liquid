var urlParser = require("util/urlParser.js");
var settings = require("util/settings/settings.js");

/* implements selecting webviews, switching between them, and creating new ones. */

var placeholderImg = document.getElementById("webview-placeholder");

var hasSeparateTitlebar = settings.get("useSeparateTitlebar");
var windowIsMaximized = false; // affects navbar height on Windows
var windowIsFullscreen = false;

function captureCurrentTab(options) {
  if (tabs.get(tabs.getSelected()).private) {
    // don't capture placeholders for private tabs
    return;
  }

  if (
    webviews.placeholderRequests.length > 0 &&
    !(options && options.forceCapture === true)
  ) {
    // capturePage doesn't work while the view is hidden
    return;
  }

  ipc.send("getCapture", {
    id: webviews.selectedId,
    width: Math.round(window.innerWidth / 10),
    height: Math.round(window.innerHeight / 10),
  });
}

// called whenever a new page starts loading, or an in-page navigation occurs
function onPageURLChange(tab, url) {
  if (
    url.indexOf("https://") === 0 ||
    url.indexOf("about:") === 0 ||
    url.indexOf("chrome:") === 0 ||
    url.indexOf("file://") === 0
  ) {
    tabs.update(tab, {
      secure: true,
      url: url,
    });
  } else {
    tabs.update(tab, {
      secure: false,
      url: url,
    });
  }
}

// called whenever a navigation finishes
function onNavigate(
  tabId,
  url,
  isInPlace,
  isMainFrame,
  frameProcessId,
  frameRoutingId
) {
  if (isMainFrame) {
    onPageURLChange(tabId, url);
  }
}

// called whenever the page finishes loading
function onPageLoad(tabId) {
  // capture a preview image if a new page has been loaded
  console.log("pae loaded", tabId);
  if (tabId === tabs.getSelected()) {
    setTimeout(function () {
      // sometimes the page isn't visible until a short time after the did-finish-load event occurs
      captureCurrentTab();
    }, 250);
  }
}

function scrollOnLoad(tabId, scrollPosition) {
  const listener = function (eTabId) {
    if (eTabId === tabId) {
      // the scrollable content may not be available until some time after the load event, so attempt scrolling several times
      // but stop once we've successfully scrolled once so we don't overwrite user scroll attempts that happen later
      for (let i = 0; i < 3; i++) {
        var done = false;
        setTimeout(function () {
          if (!done) {
            webviews.callAsync(
              tabId,
              "executeJavaScript",
              `
            (function() {
              window.scrollTo(0, ${scrollPosition})
              return window.scrollY === ${scrollPosition}
            })()
            `,
              function (err, completed) {
                if (!err && completed) {
                  done = true;
                }
              }
            );
          }
        }, 750 * i);
      }
      webviews.unbindEvent("did-finish-load", listener);
    }
  };
  webviews.bindEvent("did-finish-load", listener);
}

function setAudioMutedOnCreate(tabId, muted) {
  const listener = function () {
    webviews.callAsync(tabId, "setAudioMuted", muted);
    webviews.unbindEvent("did-navigate", listener);
  };
  webviews.bindEvent("did-navigate", listener);
}

const webviews = {
  webviewsElement: document.getElementById("webviews"),
  containerInner: document.getElementById("webviews-inner"),
  viewList: [], // [tabId]
  viewFullscreenMap: {}, // tabId, isFullscreen
  selectedId: null,
  lastPosition: 0,
  placeholderRequests: [],
  asyncCallbacks: {},
  internalPages: {
    error: urlParser.getFileURL(__dirname + "/pages/error/index.html"),
  },
  events: [],
  IPCEvents: [],

  bindEvent: function (event, fn) {
    webviews.events.push({
      event: event,
      fn: fn,
    });
  },

  unbindEvent: function (event, fn) {
    for (var i = 0; i < webviews.events.length; i++) {
      if (webviews.events[i].event === event && webviews.events[i].fn === fn) {
        webviews.events.splice(i, 1);
        i--;
      }
    }
  },

  emitEvent: function (event, viewId, args) {
    if (!webviews.viewList.includes(viewId)) {
      // the view could have been destroyed between when the event was occured and when it was recieved in the UI process, see https://github.com/minbrowser/min/issues/604#issuecomment-419653437
      return;
    }
    webviews.events.forEach(function (ev) {
      if (ev.event === event) {
        ev.fn.apply(this, [viewId].concat(args));
      }
    });
  },

  bindIPC: function (name, fn) {
    webviews.IPCEvents.push({
      name: name,
      fn: fn,
    });
  },
  viewMargins: [0, 0, 0, 0], // top, right, bottom, left

  adjustMargin: function (margins) {
    for (var i = 0; i < margins.length; i++) {
      webviews.viewMargins[i] += margins[i];
    }
    webviews.resize();
  },

  getViewBounds: function (position) {
    const x = position * 1200 + 32 * (position + 1);
    const y = 40;
    const height = 800;
    if (webviews.viewFullscreenMap[webviews.selectedId]) {
      return {
        x: x,
        y: y + 56,
        width: 1200,
        height,
      };
    } else {
      if (
        !hasSeparateTitlebar &&
        (window.platformType === "linux" ||
          window.platformType === "windows") &&
        !windowIsMaximized &&
        !windowIsFullscreen
      ) {
        var navbarHeight = 48;
      } else {
        var navbarHeight = 36;
      }

      const viewMargins = webviews.viewMargins;
      return {
        x: x + Math.round(viewMargins[3]),
        y: y + 56 + Math.round(viewMargins[0]) + navbarHeight,
        width: 1200 - Math.round(viewMargins[1] + viewMargins[3]),
        height:
          height - Math.round(viewMargins[0] + viewMargins[2]) - navbarHeight,
      };
    }
  },

  createWebview: function (id, bounds) {
    const webviewEl = document.createElement("div");
    webviewEl.className = "webview-item";
    webviewEl.setAttribute("data-webview", id);
    webviewEl.setAttribute("role", "webview");
    webviewEl.style.position = "fixed";
    webviewEl.style.left = bounds.x - 3 + "px";
    webviewEl.style.top = bounds.y - 40 + "px";
    webviewEl.style.width = bounds.width + 6 + "px";
    webviewEl.style.height = bounds.height + 43 + "px";

    const row = document.createElement("div");
    const col = document.createElement("div");
    row.classList.add("frame-row");
    col.classList.add("frame-column");
    col.classList.add("frame-left");
    const dot1 = document.createElement("span");
    dot1.classList.add("frame-dot");
    dot1.style.background = "#ED594A";
    const dot2 = document.createElement("span");
    dot2.classList.add("frame-dot");
    dot2.style.background = "#FDD800";
    const dot3 = document.createElement("span");
    dot3.classList.add("frame-dot");
    dot3.style.background = "#5AC05A";
    col.appendChild(dot1);
    col.appendChild(dot2);
    col.appendChild(dot3);
    row.appendChild(col);
    const webviewContainer = document.createElement("div");
    webviewContainer.classList.add("webview-container");
    webviewEl.appendChild(row);
    webviewEl.appendChild(webviewContainer);

    webviews.webviewsElement.style.width =
      webviews.viewList.length * 1300 + "px";

    return webviewEl;
  },
  add: function (tabId, existingViewId) {
    var tabData = tabs.get(tabId);
    const position = tabs.getIndex(tabId);

    // needs to be called before the view is created to that its listeners can be registered
    if (tabData.scrollPosition) {
      scrollOnLoad(tabId, tabData.scrollPosition);
    }

    if (tabData.muted) {
      setAudioMutedOnCreate(tabId, tabData.muted);
    }

    // if the tab is private, we want to partition it. See http://electron.atom.io/docs/v0.34.0/api/web-view-tag/#partition
    // since tab IDs are unique, we can use them as partition names
    if (tabData.private === true) {
      var partition = tabId.toString(); // options.tabId is a number, which remote.session.fromPartition won't accept. It must be converted to a string first
    }

    const bounds = webviews.getViewBounds(position);
    ipc.send("createView", {
      existingViewId,
      id: tabId,
      webPreferencesString: JSON.stringify({
        partition: partition || "persist:webcontent",
      }),
      boundsString: JSON.stringify(bounds),
      events: webviews.events
        .map((e) => e.event)
        .filter((i, idx, arr) => arr.indexOf(i) === idx),
    });

    if (!existingViewId) {
      if (tabData.url) {
        ipc.send("loadURLInView", {
          id: tabData.id,
          url: urlParser.parse(tabData.url),
        });
      } else if (tabData.private) {
        // workaround for https://github.com/minbrowser/min/issues/872
        ipc.send("loadURLInView", {
          id: tabData.id,
          url: urlParser.parse("min://newtab"),
        });
      }
    }

    webviews.viewList.push(tabId);
    const el = webviews.createWebview(tabId, bounds);
    webviews.containerInner.appendChild(el);
    if (!webviews.webviewElementMap) {
      webviews.webviewElementMap = {};
    }
    webviews.webviewElementMap[tabId] = el;
  },
  setSelected: function (id, options) {
    // options.focus - whether to focus the view. Defaults to true.
    // webviews.emitEvent("view-hidden", webviews.selectedId);

    console.log("set selected: ", id);
    // webviews.selectedId = id;
    const position = tabs.getIndex(id);

    // create the view if it doesn't already exist
    if (!webviews.viewList.includes(id)) {
      console.log("why are you missing ", id);
      // webviews.add(id);
    }

    if (webviews.placeholderRequests.length > 0) {
      // update the placeholder instead of showing the actual view
      webviews.requestPlaceholder();
      return;
    }

    // ipc.send("setView", {
    //   id: id,
    //   bounds: webviews.getViewBounds(position),
    //   focus: !options || options.focus !== false,
    // });
    webviews.emitEvent("view-shown", id);
  },
  update: function (id, url) {
    console.log("update called");
    ipc.send("loadURLInView", { id: id, url: urlParser.parse(url) });
  },
  destroy: function (id) {
    // webviews.emitEvent("view-hidden", id);

    console.log("destroy called");
    if (webviews.viewList.includes(id)) {
      webviews.viewList.splice(webviews.viewList.indexOf(id), 1);
      console.log("destroy count ", webviews.viewList.length);
      ipc.send("destroyView", id);
    }
    delete webviews.viewFullscreenMap[id];
    if (webviews.selectedId === id) {
      webviews.selectedId = null;
    }
  },
  requestPlaceholder: function (reason) {
    // if (reason && !webviews.placeholderRequests.includes(reason)) {
    //   webviews.placeholderRequests.push(reason);
    // }
    // if (webviews.placeholderRequests.length >= 1) {
    //   // create a new placeholder
    //
    //   console.log("request placeholder");
    //   var associatedTab = tasks
    //     .getTaskContainingTab(webviews.selectedId)
    //     .tabs.get(webviews.selectedId);
    //   var img = associatedTab.previewImage;
    //   if (img) {
    //     placeholderImg.src = img;
    //     placeholderImg.hidden = false;
    //   } else if (associatedTab && associatedTab.url) {
    //     captureCurrentTab({ forceCapture: true });
    //   } else {
    //     placeholderImg.hidden = true;
    //   }
    // }
    // setTimeout(function () {
    //   // wait to make sure the image is visible before the view is hidden
    //   // make sure the placeholder was not removed between when the timeout was created and when it occurs
    //   if (webviews.placeholderRequests.length > 0) {
    //     // ipc.send("hideCurrentView");
    //     // webviews.emitEvent("view-hidden", webviews.selectedId);
    //   }
    // }, 0);
  },
  hidePlaceholder: function (reason) {
    if (webviews.placeholderRequests.includes(reason)) {
      webviews.placeholderRequests.splice(
        webviews.placeholderRequests.indexOf(reason),
        1
      );
    }

    if (webviews.placeholderRequests.length === 0) {
      // multiple things can request a placeholder at the same time, but we should only show the view again if nothing requires a placeholder anymore
      if (webviews.viewList.includes(webviews.selectedId)) {
        console.log("hide placeholder: ", webviews.selectedId);
        const position = tabs.getIndex(webviews.selectedId);
        // ipc.send("setView", {
        //   id: webviews.selectedId,
        //   bounds: webviews.getViewBounds(position),
        //   focus: true,
        // });
        webviews.emitEvent("view-shown", webviews.selectedId);
      }
      // wait for the view to be visible before removing the placeholder
      setTimeout(function () {
        if (webviews.placeholderRequests.length === 0) {
          // make sure the placeholder hasn't been re-enabled
          placeholderImg.hidden = true;
        }
      }, 400);
    }
  },
  releaseFocus: function () {
    ipc.send("focusMainWebContents");
  },
  focus: function () {
    console.log("focus");
    if (webviews.selectedId) {
      // ipc.send("focusView", webviews.selectedId);
    }
  },
  changePositions: function (left) {
    const movement = left - webviews.lastPosition;
    ipc.send("changePositions", {
      movement,
    });
    for (const id in webviews.webviewElementMap) {
      const x = parseInt(
        webviews.webviewElementMap[id].style.left.replace("px", "")
      );
      webviews.webviewElementMap[id].style.left = x - movement + "px";
    }
    webviews.lastPosition = left;
  },
  resize: function () {
    console.log("I am getting called");
    webviews.viewList.forEach((id, position) => {
      ipc.send("setBounds", {
        id,
        bounds: webviews.getViewBounds(position),
      });
    });
  },
  goBackIgnoringRedirects: function (id) {
    /* If the current page is an error page, we actually want to go back 2 pages, since the last page would otherwise send us back to the error page
    TODO we want to do the same thing for reader mode as well, but only if the last page was redirected to reader mode (since it could also be an unrelated page)
    */

    var url = tabs.get(id).url;

    if (url.startsWith(urlParser.parse("min://error"))) {
      webviews.callAsync(id, "canGoToOffset", -2, function (err, result) {
        if (!err && result === true) {
          webviews.callAsync(id, "goToOffset", -2);
        } else {
          webviews.callAsync(id, "goBack");
        }
      });
    } else {
      webviews.callAsync(id, "goBack");
    }
  },
  /*
  Can be called as
  callAsync(id, method, args, callback) -> invokes method with args, runs callback with (err, result)
  callAsync(id, method, callback) -> invokes method with no args, runs callback with (err, result)
  callAsync(id, property, value, callback) -> sets property to value
  callAsync(id, property, callback) -> reads property, runs callback with (err, result)
   */
  callAsync: function (id, method, argsOrCallback, callback) {
    var args = argsOrCallback;
    var cb = callback;
    if (argsOrCallback instanceof Function && !cb) {
      args = [];
      cb = argsOrCallback;
    }
    if (!(args instanceof Array)) {
      args = [args];
    }
    if (cb) {
      var callId = Math.random();
      webviews.asyncCallbacks[callId] = cb;
    }
    ipc.send("callViewMethod", {
      id: id,
      callId: callId,
      method: method,
      args: args,
    });
  },
};

const body = document.getElementsByTagName("body")[0];
body.addEventListener("scroll", function () {
  webviews.changePositions(body.scrollLeft);
});

window.addEventListener(
  "resize",
  throttle(function () {
    if (webviews.placeholderRequests.length > 0) {
      // can't set view bounds if the view is hidden
      return;
    }
    webviews.resize();
  }, 75)
);

// leave HTML fullscreen when leaving window fullscreen
ipc.on("leave-full-screen", function () {
  // electron normally does this automatically (https://github.com/electron/electron/pull/13090/files), but it doesn't work for BrowserViews
  for (var view in webviews.viewFullscreenMap) {
    if (webviews.viewFullscreenMap[view]) {
      webviews.callAsync(
        view,
        "executeJavaScript",
        "document.exitFullscreen()"
      );
    }
  }
});

webviews.bindEvent("enter-html-full-screen", function (tabId) {
  webviews.viewFullscreenMap[tabId] = true;
  webviews.resize();
});

webviews.bindEvent("leave-html-full-screen", function (tabId) {
  webviews.viewFullscreenMap[tabId] = false;
  webviews.resize();
});

ipc.on("maximize", function () {
  windowIsMaximized = true;
  webviews.resize();
});

ipc.on("unmaximize", function () {
  windowIsMaximized = false;
  webviews.resize();
});

ipc.on("enter-full-screen", function () {
  windowIsFullscreen = true;
  webviews.resize();
});

ipc.on("leave-full-screen", function () {
  windowIsFullscreen = false;
  webviews.resize();
});

webviews.bindEvent("did-start-navigation", onNavigate);
webviews.bindEvent("will-redirect", onNavigate);
webviews.bindEvent(
  "did-navigate",
  function (tabId, url, httpResponseCode, httpStatusText) {
    onPageURLChange(tabId, url);
  }
);

webviews.bindEvent("did-finish-load", onPageLoad);

webviews.bindEvent("page-title-updated", function (tabId, title, explicitSet) {
  tabs.update(tabId, {
    title: title,
  });
});

webviews.bindEvent(
  "did-fail-load",
  function (tabId, errorCode, errorDesc, validatedURL, isMainFrame) {
    if (errorCode && errorCode !== -3 && isMainFrame && validatedURL) {
      webviews.update(
        tabId,
        webviews.internalPages.error +
          "?ec=" +
          encodeURIComponent(errorCode) +
          "&url=" +
          encodeURIComponent(validatedURL)
      );
    }
  }
);

webviews.bindEvent("crashed", function (tabId, isKilled) {
  var url = tabs.get(tabId).url;

  tabs.update(tabId, {
    url:
      webviews.internalPages.error + "?ec=crash&url=" + encodeURIComponent(url),
  });

  // the existing process has crashed, so we can't reuse it
  webviews.destroy(tabId);
  webviews.add(tabId);

  if (tabId === tabs.getSelected()) {
    webviews.setSelected(tabId);
  }
});

webviews.bindIPC("getSettingsData", function (tabId, args) {
  if (!urlParser.isInternalURL(tabs.get(tabId).url)) {
    throw new Error();
  }
  webviews.callAsync(tabId, "send", ["receiveSettingsData", settings.list]);
});
webviews.bindIPC("setSetting", function (tabId, args) {
  if (!urlParser.isInternalURL(tabs.get(tabId).url)) {
    throw new Error();
  }
  settings.set(args[0].key, args[0].value);
});

settings.listen(function () {
  tasks.forEach(function (task) {
    task.tabs.forEach(function (tab) {
      if (tab.url.startsWith("file://")) {
        try {
          webviews.callAsync(tab.id, "send", [
            "receiveSettingsData",
            settings.list,
          ]);
        } catch (e) {
          // webview might not actually exist
        }
      }
    });
  });
});

webviews.bindIPC("scroll-position-change", function (tabId, args) {
  tabs.update(tabId, {
    scrollPosition: args[0],
  });
});

ipc.on("view-event", function (e, args) {
  webviews.emitEvent(args.event, args.viewId, args.args);
});

ipc.on("async-call-result", function (e, args) {
  webviews.asyncCallbacks[args.callId](args.error, args.result);
  delete webviews.asyncCallbacks[args.callId];
});

ipc.on("view-ipc", function (e, args) {
  if (!webviews.viewList.includes(args.id)) {
    // the view could have been destroyed between when the event was occured and when it was recieved in the UI process, see https://github.com/minbrowser/min/issues/604#issuecomment-419653437
    return;
  }
  webviews.IPCEvents.forEach(function (item) {
    if (item.name === args.name) {
      item.fn(args.id, [args.data], args.frameId);
    }
  });
});

setInterval(function () {
  captureCurrentTab();
}, 15000);

ipc.on("captureData", function (e, data) {
  tabs.update(data.id, { previewImage: data.url });
  if (
    data.id === webviews.selectedId &&
    webviews.placeholderRequests.length > 0
  ) {
    placeholderImg.src = data.url;
    placeholderImg.hidden = false;
  }
});

/* focus the view when the window is focused */

ipc.on("windowFocus", function () {
  if (
    webviews.placeholderRequests.length === 0 &&
    document.activeElement.tagName !== "INPUT"
  ) {
    webviews.focus();
  }
});

module.exports = webviews;
