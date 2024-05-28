import {NavLink} from "react-router-dom";
export default function Nav() {
  return(
    <nav id="main-menu" aria-label="Main navigation">
      <ul id="navLinks">
        <li><NavLink to="/">Sign Up</NavLink></li>
        <li><NavLink to="/">Login</NavLink></li>
      </ul>
    </nav>
  )
}