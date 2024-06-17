import {NavLink} from "react-router-dom";
import AccountMenu from "./modals/AccountMenu";


export default function Nav({}) {
  return(
    <nav id="main-menu" aria-label="Main navigation">
      
      <ul id="navLinks">
        <li><NavLink to="/admin">Dashboard</NavLink></li>
        <li><NavLink to="/admin/events">Events</NavLink></li>
        <li><NavLink to="/admin/activities">Activities</NavLink></li>
        <li><NavLink to="/admin/equipment">Equipment</NavLink></li>
        <li><AccountMenu /></li>
      </ul>
    </nav>
  )
}