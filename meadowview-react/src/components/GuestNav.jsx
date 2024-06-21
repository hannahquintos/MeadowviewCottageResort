import {NavLink} from "react-router-dom";
import AccountMenu from "./modals/AccountMenu";


export default function Nav({}) {
  return(
        <div id="headerContent">
        <div id="siteName">
            <img src="/meadowview-logo.svg" alt="" />
            <h2><NavLink to="/home">Meadowview Cottage Resort</NavLink></h2>
        </div>
        <nav id="main-menu" aria-label="Main navigation">
          <ul id="navLinks">
            <li><NavLink to="/home">Home</NavLink></li>
            <li><NavLink to="/events">Events</NavLink></li>
            <li><NavLink to="/activities">Activities</NavLink></li>
            <li><NavLink to="/equipment">Equipment</NavLink></li>
            <li><AccountMenu /></li>
          </ul>
        </nav>
    </div>
  )
}