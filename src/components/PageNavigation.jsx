import { Link } from "react-router-dom";
import styles from "./PageNavigation.module.css";

function PageNavigation() {
  return (
    <div className={styles.navigation}>
      <button
        type="button"
        className={styles.button}
        onClick={() => window.history.back()}
      >
        <span>←</span>
        Back
      </button>

      <Link
        to="/"
        className={styles.button}
      >
        <span>⌂</span>
        Home
      </Link>
    </div>
  );
}

export default PageNavigation;