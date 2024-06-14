import Nav from "./Nav";
import NavLoggedOut from "./Nav-LoggedOut"
import axios from "axios";
import React, { useState, useEffect } from 'react';

export default function Header() {

  axios.defaults.withCredentials = true;

  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.get("http://localhost:3000/auth/verify")
      .then(res => {
        setIsLoggedIn(res.data.status);
      })
      .catch(e => {
        console.error(e);
        setIsLoggedIn(false);
      });
  }, []);

  return(
    <header>
      <div className="contentWrapper">
          <div id="headerContent">
              <div id="siteName">
                  <img src="./src/assets/meadowview-logo.svg" alt="" />
                  <h2><a href="/">Meadowview Cottage Resort</a></h2>
              </div>
              {isLoggedIn ? <Nav /> : <NavLoggedOut />}
          </div>
      </div>
    </header>
  );
  
  }