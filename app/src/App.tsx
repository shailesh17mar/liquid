import React, {useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

const login = () => {
  window.chrome.runtime.sendMessage({message: 'login'}, function () {
    window.close();
  });
};
const App = () => {
  // useEffect(() => {
  //   window.chrome.identity.getProfileUserInfo((user: any) => {
  //     console.log(user);
  //   });
  // }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div className="App-body">
        <button className="Google-button" onClick={login}>
          <div className="Google-button-content">
            <img
              className="Google-icon"
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            />
            Sign in with Google
          </div>
        </button>
      </div>
    </div>
  );
};

export default App;
