import "emoji-log";
import { browser } from "webextension-polyfill-ts";

browser.runtime.onInstalled.addListener((): void => {
  console.emoji("🦄", "extension installed");
});

async function syncCookies() {
  const cookies = await browser.cookies.getAll({});
  for (const i in cookies) {
    console.log(JSON.stringify(cookies[i]));
  }
}

syncCookies();
