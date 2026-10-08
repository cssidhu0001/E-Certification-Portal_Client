import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import styles from "./Conference.module.css";
import PageNavigation from "../components/PageNavigation";

function Conference() {
   
  return (
    <PageShell>
      <main className={styles.page}>

        {/* HERO */}

        <section className={styles.hero}>
          <div className={styles.heroContent}>

            <span className={styles.eyebrow}>
              1ST INTERNATIONAL CONFERENCE
            </span>

            <h1>
              IANETL 2026
            </h1>

            <h2>
              Innovative Approaches in Nursing Education
              for Excellence in Teaching & Learning
            </h2>

            <div className={styles.meta}>
              <span>
                09th – 11th October 2026
              </span>

              <span className={styles.divider}>
                |
              </span>

              <span>
                MIET Kumaon, Haldwani
              </span>
            </div>

            <div className={styles.heroActions}>
              <a
                  href="https://meet.google.com/zby-gcxz-uez"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.primaryButton}
              >
                <span className={styles.liveDot}></span>
                Join Live Presentation
                <span>→</span>
              </a>

              <a
                href="#resources"
                className={styles.secondaryButton}
              >
                Conference Resources
              </a>
            </div>

          </div>
        </section>

        {/* LIVE PRESENTATION */}

        <section className={styles.liveSection}>

          <div className={styles.liveCard}>

            <div className={styles.liveBadge}>
              <span></span>
              ONLINE PRESENTATION
            </div>

            <div className={styles.liveContent}>
              <div>
                <h2>
                  Join the Virtual Conference
                </h2>

                <p>
                  Online participants and presenters
                  can join the conference through
                  Google Meet.
                </p>
              </div>

              <a
               href="https://meet.google.com/zby-gcxz-uez"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.meetButton}
              >
                Join Google Meet →
              </a>
            </div>

          </div>

        </section>

        {/* RESOURCES */}

        <section
          id="resources"
          className={styles.resources}
        >
          <div className={styles.sectionHeading}>
            <span>
              CONFERENCE RESOURCES
            </span>

            <h2>
              Everything you need in one place.
            </h2>

            <p>
              Access conference information,
              presentation resources and certificate
              services from here.
            </p>
          </div>

          <div className={styles.resourceGrid}>

            <Resource
              number="01"
              title="Conference Schedule"
              description="View sessions and presentation timings."
              href="/schedule"
            />

            <Resource
              number="02"
              title="Watch IANETL 2026 Live"
              description=""
              href="YOUTUBE_LINK"
            />
            <Resource
              number="03"
              title="Abstract Book"
              description="Access the conference abstract book."
              href="/abstract-book.pdf"
            />

        <Resource
              number="04"
              title="Register for Virtual Certificate"
              description="Virtual Certification process is live you can downlaod your Virtual Certificate after Verification by Admin!"
              href="/register"
            />

            <Link
              to="/status"
              className={styles.resourceCard}
            >
              <span>05</span>

              <div>
                <h3>
                  Certificate Status
                </h3>

                <p>
                  Check your certificate status.
                </p>
              </div>

              <strong>→</strong>
            </Link>

            <Link
              to="/verify"
              className={styles.resourceCard}
            >
              <span>06</span>

              <div>
                <h3>
                  Certificate Verification
                </h3>

                <p>
                  Verify an issued certificate.
                </p>
              </div>

              <strong>→</strong>
            </Link>

          </div>
        </section>

        {/* INFORMATION */}

        <section className={styles.infoSection}>

          <div className={styles.infoCard}>
            <span>01</span>

            <h3>
              Online Presenters
            </h3>

            <p>
              Please join the Google Meet session
              at least 10 minutes before your
              scheduled presentation.
            </p>
          </div>

          <div className={styles.infoCard}>
            <span>02</span>

            <h3>
              Presentation Etiquette
            </h3>

            <p>
              Keep your microphone muted until you
              are invited to speak and keep your
              presentation ready.
            </p>
          </div>

          <div className={styles.infoCard}>
            <span>03</span>

            <h3>
              Need Assistance?
            </h3>

            <p>
              For technical or conference-related
              assistance, please contact the
              conference help desk.
            </p>

            <Link to="/contact">
              Contact Help Desk →
            </Link>
          </div>

        </section>
<PageNavigation/>
      </main>
    </PageShell>
  );
}

function Resource({
  number,
  title,
  description,
  href,
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.resourceCard}
    >
      <span>{number}</span>

      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <strong>→</strong>
    </a>
  );
}

export default Conference;