import {NavLink} from "react-router-dom";
import AccountMenu from "./modals/AccountMenu";


export default function Nav() {
  return(
    <nav id="main-menu" aria-label="Main navigation">
      
      <ul id="navLinks">
        <li><NavLink to="/signup">Sign Up</NavLink></li>
        <li><NavLink to="/login">Login</NavLink></li>
      </ul>
    </nav>
  )
}