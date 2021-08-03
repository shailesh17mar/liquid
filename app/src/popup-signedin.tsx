import * as React from 'react';
import * as ReactDOM from 'react-dom';

import AuthenticatedApp from './AuthenticatedApp';
import './popup.css';

const mountNode = document.getElementById('popup');
// window.chrome.identity.getProfileUserInfo((user: any) => {
ReactDOM.render(<AuthenticatedApp />, mountNode);
