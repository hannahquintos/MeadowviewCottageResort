import Nav from "./Nav";
import NavLoggedOut from "./Nav-LoggedOut";
import React, { useContext } from 'react';
import useAuth from '../hooks/useAuth';


export default function Header() {

  const { auth } = useAuth();

  return(
    <header>
      <div className="contentWrapper">
          <div id="headerContent">
              <div id="siteName">
                  <img src="./src/assets/meadowview-logo.svg" alt="" />
                  <h2><a href="/">Meadowview Cottage Resort</a></h2>
              </div>
              {/* change nav links based on if user is logged in or not */}
              {auth?.email ? <Nav /> : <NavLoggedOut />}
          </div>
      </div>
    </header>
  );
  
  }