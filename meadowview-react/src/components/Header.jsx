import GuestNav from "./GuestNav";
import AdminNav from "./AdminNav";
import NavLoggedOut from "./NavLoggedOut";
import React, { useContext } from 'react';
import useAuth from '../hooks/useAuth';


export default function Header() {

  const { auth } = useAuth();

  return(
    <header>
      <div className="contentWrapper">
          <div id="headerContent">
              <div id="siteName">
                  <img src="/meadowview-logo.svg" alt="" />
                  {auth?.role === 'Guest' && <h2><a href="/home">Meadowview Cottage Resort</a></h2>}
                  {auth?.role === 'Admin' && <h2><a href="/admin">Meadowview Cottage Resort</a></h2>}
                  {!auth?.role && <h2><a href="/">Meadowview Cottage Resort</a></h2>}
              </div>
              {/* change nav links based on user */}
              {auth?.role === 'Guest' && <GuestNav />}
              {auth?.role === 'Admin' && <AdminNav />}
              {!auth?.role && <NavLoggedOut />}
          </div>
      </div>
    </header>
  );
  
  }