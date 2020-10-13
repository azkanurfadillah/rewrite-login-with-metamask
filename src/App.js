import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './Login/Login'
import Profile from './Profile/Profile'

const LS_KEY = 'login-with-metamask:auth';


function App() {
  const [auth, setAuth] = useState(undefined)


  useEffect(() => {
    // Access token is stored in localstorage
    const ls = window.localStorage.getItem(LS_KEY);

    const auth = ls && JSON.parse(ls);
    setAuth(auth)
    console.log("component did mount", auth)
  }, [true])

  // const handleLoggedIn = (data) => {
  //   localStorage.setItem(LS_KEY, JSON.stringify(auth));
  //   console.log("handleLoggedIn", auth, data)
  // };

  const handleLoggedOut = () => {
    localStorage.removeItem(LS_KEY);
    setAuth(undefined);
  };

  console.log("AUTH", auth)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div className="App-intro">
        {auth ? (
          <Profile auth={auth} onLoggedOut={handleLoggedOut} />
        ) : (
            <Login setAuth={setAuth}
            //  onLoggedIn={handleLoggedIn} 
            />
          )}
      </div>
    </div>
  );
}

export default App;
