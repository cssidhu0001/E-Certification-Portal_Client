import { Link, NavLink } from "react-router-dom";
import styles from "./Header.module.css";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <img
            src="/miet.png"
            alt="MIET Kumaon"
            className={styles.logo}
          />

          <span>
            <strong>MIET Kumaon</strong>
            <small>College of Nursing, Haldwani</small>
          </span>
        </Link>

        <nav className={styles.nav}>
          <NavLink to="/" end>
            Home
          </NavLink>

          <NavLink to="/register">
            Register
          </NavLink>

          <NavLink to="/status">
            Certificate Status
          </NavLink>

          <NavLink to="/admin/login">
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;