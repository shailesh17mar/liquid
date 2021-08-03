import {
  PROMPT,
  RESPONSE_TYPE,
  STATE,
  REDIRECT_URI,
  SCOPE,
  CLIENT_ID,
} from './config';
import {KJUR, b64utoutf8} from 'jsrsasign';

export type UserInfo = {
  iss: string;
  aud: string;
  sub: string;
};

class Auth {
  private static _userSignedIn = false;
  private static _user: UserInfo | undefined = undefined;

  public static get userSignedIn() {
    return this._userSignedIn;
  }

  public static set userSignedIn(isSignedIn: boolean) {
    this._userSignedIn = isSignedIn;
  }

  private static _token: string | null = null;

  public static get token() {
    return this._token;
  }

  private static set newToken(newToken: string) {
    this._token = newToken;
  }

  static extractHostname = (url: string): string => {
    let hostname: string | null = null;
    if (url.indexOf('//') > -1) {
      hostname = url.split('/')[2];
    } else {
      hostname = url.split('/')[0];
    }
    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];
    return hostname;
  };

  static authenticate = (sendResponse: Function) =>
    chrome.identity.launchWebAuthFlow(
      {
        url: Auth.createAuthEndpoint(),
        interactive: true,
      },
      (redirectUrl?: string) => {
        if (chrome.runtime.lastError || !redirectUrl) {
          // problem signing in
        } else {
          let idToken = redirectUrl.substring(
            redirectUrl.indexOf('id_token=') + 9
          );
          idToken = idToken.substring(0, idToken.indexOf('&'));
          const userInfo = KJUR.jws.JWS.readSafeJSONString(
            b64utoutf8(idToken.split('.')[1])
          );
          const user = userInfo! as UserInfo;

          if (
            (user.iss === 'https://accounts.google.com' ||
              user.iss === 'accounts.google.com') &&
            user.aud === CLIENT_ID
          ) {
            // console.log('User successfully signed in.');
            Auth.userSignedIn = true;
            Auth.newToken = idToken;

            chrome.storage.sync.set({token: idToken}, () => {
              chrome.browserAction.setPopup(
                {popup: './popup-signedin.html'},
                () => {
                  console.log('sending success ', Auth.token);
                  sendResponse('success');
                }
              );
            });
          } else {
            // invalid credentials
            console.log('Invalid credentials.');
          }
        }
      }
    );

  static getUser = () => {
    if (Auth._user) return Auth._user;
    Auth._user = KJUR.jws.JWS.readSafeJSONString(
      b64utoutf8(Auth._token!.split('.')[1])
    ) as UserInfo;
    return Auth._user;
  };

  private static createAuthEndpoint = () => {
    const nonce = encodeURIComponent(
      Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
    );

    const openIdEndpointUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&state=${STATE}&nonce=${nonce}&prompt=${PROMPT}`;

    return openIdEndpointUrl;
  };
}

export default Auth;
