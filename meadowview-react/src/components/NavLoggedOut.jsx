import {NavLink} from "react-router-dom";
import AccountMenu from "./modals/AccountMenu";


export default function Nav() {
  return(
    <div id="headerContent">
        <div id="siteName">
            <img src="/meadowview-logo.svg" alt="" />
            <h2><a href="/">Meadowview Cottage Resort</a></h2>
        </div>
        <nav id="main-menu" aria-label="Main navigation">
          <ul id="navLinks">
            <li><NavLink to="/signup">Sign Up</NavLink></li>
            <li><NavLink to="/login">Login</NavLink></li>
          </ul>
        </nav>
    </div>
  )
}