import {NavLink} from "react-router-dom";
export default function Nav() {
  return(
    <nav id="main-menu" aria-label="Main navigation">
      <ul id="navLinks">
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/events">Events</NavLink></li>
        <li><NavLink to="/activities">Activities</NavLink></li>
        <li><NavLink to="/equipment">Equipment</NavLink></li>
        <li><NavLink to="/"><img src="./src/assets/user-icon.svg" alt="User profile" /></NavLink></li>
      </ul>
    </nav>
  )
}