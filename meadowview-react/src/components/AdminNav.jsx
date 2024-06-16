import {NavLink} from "react-router-dom";
import AccountMenu from "./modals/AccountMenu";


export default function Nav({}) {
  return(
    <nav id="main-menu" aria-label="Main navigation">
      
      <ul id="navLinks">
        <li><NavLink to="/">Dashboard</NavLink></li>
        <li><NavLink to="/events">Events</NavLink></li>
        <li><NavLink to="/activities">Activities</NavLink></li>
        <li><NavLink to="/equipment">Equipment</NavLink></li>
        <li><AccountMenu /></li>
      </ul>
    </nav>
  )
}