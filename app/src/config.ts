import DEVICES from './devices';

const CLIENT_ID = encodeURIComponent(
  '1077167489512-so5ln69eqbbjqpckatnmt9hf8kbues2b.apps.googleusercontent.com'
);

const REDIRECT_URI = encodeURIComponent(
  'https://iilocmnalcgcmhllmglddcpinbmobpag.chromiumapp.org/'
);

const SCOPE = encodeURIComponent('openid email profile');

const STATE = encodeURIComponent(
  'meet' + Math.random().toString(36).substring(2, 15)
);

const PROMPT = encodeURIComponent('consent');

const RESPONSE_TYPE = encodeURIComponent('id_token');

export {CLIENT_ID, RESPONSE_TYPE, DEVICES, SCOPE, REDIRECT_URI, STATE, PROMPT};
