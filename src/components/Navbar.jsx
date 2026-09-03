import { NavLink } from "react-router";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.siteNav} aria-label="Hovednavigation">
      <NavLink className={styles.brand} to="/">
        mellemrum<span>.</span>
      </NavLink>
      <div className={styles.navLinks}>
        <NavLink to="/">Events</NavLink>
        <NavLink to="/om">Om Mellemrum</NavLink>
      </div>
    </nav>
  );
}
