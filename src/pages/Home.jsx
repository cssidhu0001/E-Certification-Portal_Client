import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import styles from "./Home.module.css";

function Home() {
  return (
    <PageShell>
      <section className={styles.hero}>
        <div className={styles.content}>
          <span className={styles.eyebrow}>
            1st International Conference • IANETL 2026
          </span>

          <h1>
            Innovative Approaches in Nursing Education
            <span>
              for Excellence in Teaching &amp; Learning
            </span>
          </h1>

          <p className={styles.description}>
            Official conference portal of MIET Kumaon, College of Nursing,
            Haldwani for registration, certificate status and certificate
            verification.
          </p>

          <div className={styles.dateGrid}>
            <div>
              <strong>09th – 11th</strong>
              <span>October 2026</span>
            </div>

            <div>
              <strong>IANETL 2026</strong>
              <span>MIET Kumaon, Haldwani</span>
            </div>
          </div>

          <div className={styles.actions}>
            <Link to="/register" className={styles.primary}>
              Register Now →
            </Link>

            <Link to="/status" className={styles.secondary}>
              Certificate Status
            </Link>
          </div>
        </div>

        <div className={styles.poster}>
          <img
            src="/conference-poster.png"
            alt="IANETL 2026 conference poster"
          />
        </div>
      </section>

      <section className={styles.cards}>
        <Link to="/register" className={styles.card}>
          <span>01</span>
          <h2>Registration</h2>
          <p>
            Submit your conference details through the online
            registration form.
          </p>
          <strong>Register →</strong>
        </Link>

        <Link to="/status" className={styles.card}>
          <span>02</span>
          <h2>Certificate Status</h2>
          <p>
            Check approval status and access your certificate after
            approval.
          </p>
          <strong>Check Status →</strong>
        </Link>

        {/* MANUAL CERTIFICATE VERIFICATION */}
        <Link to="/verify" className={styles.card}>
          <span>03</span>
          <h2>Verify Certificate</h2>
          <p>
            Verify your certificate using your registered email
            address and certificate ID.
          </p>
          <strong>Verify →</strong>
        </Link>
      </section>
    </PageShell>
  );
}

export default Home;