import {NavLink} from "react-router-dom";
export default function Nav() {
  return(
    <nav id="main-menu" aria-label="Main navigation">
      <ul id="navLinks">
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/">Events</NavLink></li>
        <li><NavLink to="/activities">Activities</NavLink></li>
        <li><NavLink to="/">Equipment</NavLink></li>
      </ul>
    </nav>
  )
}