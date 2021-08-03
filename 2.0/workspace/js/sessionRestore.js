var browserUI = require("browserUI.js");
var webviews = require("webviews.js");
var tabEditor = require("navbar/tabEditor.js");
var tabState = require("tabState.js");

const sessionRestore = {
  savePath:
    window.globalArgs["user-data-path"] +
    (platformType === "windows"
      ? "\\sessionRestore.json"
      : "/sessionRestore.json"),
  previousState: null,
  save: function (forceSave, sync) {
    var stateString = JSON.stringify(tasks.getStringifyableState());
    var data = {
      version: 2,
      state: JSON.parse(stateString),
      saveTime: Date.now(),
    };

    // save all tabs that aren't private

    for (var i = 0; i < data.state.tasks.length; i++) {
      data.state.tasks[i].tabs = data.state.tasks[i].tabs.filter(function (
        tab
      ) {
        return !tab.private;
      });
    }

    if (forceSave === true || stateString !== sessionRestore.previousState) {
      if (sync === true) {
        fs.writeFileSync(sessionRestore.savePath, JSON.stringify(data));
      } else {
        fs.writeFile(
          sessionRestore.savePath,
          JSON.stringify(data),
          function (err) {
            if (err) {
              console.warn(err);
            }
          }
        );
      }
      sessionRestore.previousState = stateString;
    }
  },
  restore: function () {
    var savedStringData;
    try {
      savedStringData = fs.readFileSync(sessionRestore.savePath, "utf-8");
    } catch (e) {
      console.warn("failed to read session restore data", e);
    }

    /*
    Disabled - show a user survey on startup
    // the survey should only be shown after an upgrade from an earlier version
    var shouldShowSurvey = false
    if (savedStringData && !localStorage.getItem('1.15survey')) {
      shouldShowSurvey = true
    }

    localStorage.setItem('1.15survey', 'true')
    */

    try {
      // first run, show the tour
      if (!savedStringData) {
        tasks.setSelected(tasks.add()); // create a new task

        var newTab = tasks.getSelected().tabs.add({
          url: "https://minbrowser.github.io/min/tour",
        });
        browserUI.addTab(newTab, {
          enterEditMode: false,
        });
        return;
      }

      const config = {
        version: 2,
        state: {
          tasks: [
            {
              name: null,
              tabs: [
                // {
                //   url: "https://www.google.com/",
                //   title: "Google",
                //   id: "16418328774062884",
                //   lastActivity: 1625216990714,
                //   secure: true,
                //   private: false,
                //   readerable: false,
                //   backgroundColor: {
                //     color: "rgb(65,135,245)",
                //     textColor: "white",
                //     isLowContrast: false,
                //   },
                //   scrollPosition: 0,
                //   selected: false,
                //   muted: false,
                //   favicon: {
                //     url: "https://www.google.com/favicon.ico",
                //     luminance: 126.60999999999999,
                //   },
                // },
                {
                  url: "https://www.linkedin.com/",
                  title: "LinkedIn: Log In or Sign Up",
                  id: "54676244495769780",
                  lastActivity: 1626952491425,
                  secure: true,
                  private: false,
                  readerable: false,
                  backgroundColor: {
                    color: "rgb(0,115,180)",
                    textColor: "white",
                    isLowContrast: false,
                  },
                  scrollPosition: 0,
                  selected: false,
                  muted: false,
                  favicon: {
                    url: "https://static-exp1.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca",
                    luminance: 88.02499999999999,
                  },
                },
                // {
                //   url: "https://www.youtube.com/",
                //   title: "YouTube",
                //   id: "29539118383251916",
                //   lastActivity: 1625217002563,
                //   secure: true,
                //   private: false,
                //   readerable: false,
                //   themeColor: {
                //     color: "rgb(255,255,255)",
                //     textColor: "black",
                //     isLowContrast: true,
                //   },
                //   scrollPosition: 0,
                //   selected: true,
                //   muted: false,
                // },
              ],
              tabHistory: { depth: 10, stack: [] },
              id: "12668821582336532",
            },
          ],
          selectedTask: "12668821582336532",
        },
      };
      var data = config;
      // the data isn't restorable
      if (
        (data.version && data.version !== 2) ||
        (data.state && data.state.tasks && data.state.tasks.length === 0)
      ) {
        tasks.setSelected(tasks.add());

        browserUI.addTab(tasks.getSelected().tabs.add());
        return;
      }

      // add the saved tasks

      data.state.tasks.forEach(function (task) {
        // restore the task item
        tasks.add(task);

        /*
        If the task contained only private tabs, none of the tabs will be contained in the session restore data, but tasks must always have at least 1 tab, so create a new empty tab if the task doesn't have any.
        */
        if (task.tabs.length === 0) {
          tasks.get(task.id).tabs.add();
        }
      });
      tasks.setSelected(data.state.selectedTask);

      // switch to the previously selected tasks

      if (tasks.getSelected().tabs.isEmpty() || !data.saveTime) {
        browserUI.switchToTask(data.state.selectedTask);
        if (tasks.getSelected().tabs.isEmpty()) {
          tabEditor.show(tasks.getSelected().tabs.getSelected());
        }
      } else {
        window.createdNewTaskOnStartup = true;
        // try to reuse a previous empty task
        var lastTask = tasks.byIndex(tasks.getLength() - 1);
        if (lastTask && lastTask.tabs.isEmpty() && !lastTask.name) {
          browserUI.switchToTask(lastTask.id);
          tabEditor.show(lastTask.tabs.getSelected());
        } else {
          browserUI.addTask();
        }
      }
      browserUI.setupViews();

      /* Disabled - show user survey
      // if this isn't the first run, and the survey popup hasn't been shown yet, show it
      if (shouldShowSurvey) {
        fetch('https://minbrowser.org/survey/survey15.json').then(function (response) {
          return response.json()
        }).then(function (data) {
          setTimeout(function () {
            if (data.available && data.url) {
              if (tasks.getSelected().tabs.isEmpty()) {
                webviews.update(tasks.getSelected().tabs.getSelected(), data.url)
                tabEditor.hide()
              } else {
                var surveyTab = tasks.getSelected().tabs.add({
                  url: data.url
                })
                browserUI.addTab(surveyTab, {
                  enterEditMode: false
                })
              }
            }
          }, 200)
        })
      }
      */
    } catch (e) {
      // an error occured while restoring the session data

      console.error("restoring session failed: ", e);

      var backupSavePath = require("path").join(
        window.globalArgs["user-data-path"],
        "sessionRestoreBackup-" + Date.now() + ".json"
      );

      fs.writeFileSync(backupSavePath, savedStringData);

      // destroy any tabs that were created during the restore attempt
      tabState.initialize();

      // create a new tab with an explanation of what happened
      var newTask = tasks.add();
      var newSessionErrorTab = tasks.get(newTask).tabs.add({
        url:
          "file://" +
          __dirname +
          "/pages/sessionRestoreError/index.html?backupLoc=" +
          encodeURIComponent(backupSavePath),
      });

      browserUI.switchToTask(newTask);
      browserUI.switchToTab(newSessionErrorTab);
    }
  },
  initialize: function () {
    setInterval(sessionRestore.save, 30000);

    window.onbeforeunload = function (e) {
      sessionRestore.save(true, true);
    };
  },
};

module.exports = sessionRestore;
