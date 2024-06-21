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
          {/* change nav links based on user */}
          {auth?.role === 'Guest' && <GuestNav />}
          {auth?.role === 'Admin' && <AdminNav />}
          {!auth?.role && <NavLoggedOut />}
      </div>
    </header>
  );
  
  }