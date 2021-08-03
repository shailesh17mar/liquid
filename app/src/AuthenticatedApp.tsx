import React, {useEffect, useState} from 'react';
import Switch from './components/Switch';
import logo from './logo.svg';
import './App.css';

type User = {
  id: string;
  name: string;
  email: string;
  picture: string;
};

const AuthenticatedApp = () => {
  const [user, setUser] = useState<User | null>(null);
  const [checked, setChecked] = useState<boolean>(false);
  useEffect(() => {
    chrome.storage.sync.get(['token'], async ({token}) => {
      const response = await fetch(
        'https://oauth2.googleapis.com/tokeninfo?id_token=' + token
      );
      const user = await response.json();
      setUser({
        id: user.sub,
        name: user.name,
        email: user.email,
        picture: user.picture,
      });
    });
  }, []);

  useEffect(() => {
    if (checked) {
      const queryOptions = {active: true, currentWindow: true};
      chrome.tabs.query(queryOptions, tabs => {
        const tab = tabs[0];
        chrome.runtime.sendMessage(
          {message: 'realtime-mode', tab},
          function (response) {}
        );
      });
    }
  }, [checked]);

  if (!user) return <>Loading...</>;
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div className="App-body">
        <div className="User-card">
          <div className="User-avatar">
            <img width="48" height="48" src={user.picture} />
          </div>
          <div className="User-info">
            <div>{user.name}</div>
            <div>{user.email}</div>
          </div>
        </div>
        <div className="border" />
        <div className="App-control">
          <Switch checked={checked} onChange={setChecked} />
        </div>
      </div>
      <div>
        <div className="App-actions">
          <button className="button button-primary">
            Start Collaborating
            <svg
              className="button-icon"
              width="8"
              height="16"
              viewBox="0 0 8 14"
              fill="none"
            >
              <path
                d="M1 13L7 7L1 1"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedApp;
