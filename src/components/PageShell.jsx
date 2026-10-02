import Header from "./Header";
import styles from "./PageShell.module.css";

function PageShell({ children, footer = true }) {
  return (
    <div className={styles.shell}>
      <Header />
      <main className={styles.main}>{children}</main>

      {footer && (
        <footer className={styles.footer}>
          <div>
            <strong>MIET Kumaon, College of Nursing, Haldwani</strong>
            <span>1st International Conference • IANETL 2026</span>
          </div>
          <a href="mailto:nursingconference@mietkumaon.ac.in">
            nursingconference@mietkumaon.ac.in
          </a>
        </footer>
      )}
    </div>
  );
}

export default PageShell;
