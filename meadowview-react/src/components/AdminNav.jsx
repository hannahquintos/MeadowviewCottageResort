import {NavLink} from "react-router-dom";
import AccountMenu from "./modals/AccountMenu";


export default function Nav({}) {
  return(
    <div id="headerContent">
        <div id="siteName">
            <img src="/meadowview-logo.svg" alt="" />
            <h2><NavLink to="/admin">Meadowview Cottage Resort</NavLink></h2>
        </div>
        <nav id="main-menu" aria-label="Main navigation">
          <ul id="navLinks">
            <li><NavLink to="/admin/users">User Accounts</NavLink></li>
            <li><NavLink to="/admin/events">Events</NavLink></li>
            <li><NavLink to="/admin/activities">Activities</NavLink></li>
            <li><NavLink to="/admin/equipment">Equipment</NavLink></li>
            <li><AccountMenu /></li>
          </ul>
        </nav>
    </div>
  )
}