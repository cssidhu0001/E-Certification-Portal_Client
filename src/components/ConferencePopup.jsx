import { Link } from "react-router-dom";
import styles from "./ConferencePopup.module.css";
import PageNavigation from "./PageNavigation";

function ConferencePopup({ isOpen, onClose }) {
     
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
    >
      <div className={styles.modal}>

        {/* CLOSE */}

        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        {/* HEADER */}

        <div className={styles.header}>
          <span className={styles.eyebrow}>
            IANETL 2026
          </span>

          <h2>
            Virtual Conference
          </h2>

          <p>
            Your central access point for online
            presentations, conference resources
            and important updates.
          </p>
        </div>

        {/* EVENT INFO */}

        <div className={styles.eventInfo}>
          <div>
            <span>EVENT</span>
            <strong>
              1st International Conference
            </strong>
          </div>

          <div>
            <span>DATE</span>
            <strong>
              09th – 11th October 2026
            </strong>
          </div>

          <div>
            <span>VENUE</span>
            <strong>
              MIET Kumaon, Haldwani
            </strong>
          </div>
        </div>

        {/* LIVE CARD */}

        <div className={styles.liveCard}>
          <div className={styles.liveTop}>
            <span className={styles.liveDot}></span>

            <span>
              ONLINE PRESENTATION
            </span>
          </div>

          <h3>
            Join the Virtual Conference
          </h3>

          <p>
            Online participants and presenters can
            join the conference through Google Meet.
          </p>

          <a
            href="https://meet.google.com/zby-gcxz-uez"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.meetButton}
          >
            Join Google Meet
            <span>→</span>
          </a>
        </div>

        {/* RESOURCES */}

        <div className={styles.resources}>
          <div className={styles.resourceHeading}>
            <span>QUICK ACCESS</span>
            <h3>
              Conference Resources
            </h3>
          </div>

          <div className={styles.resourceGrid}>

       
            <a
              href="/schedule"
              rel="noopener noreferrer"
              className={styles.resource}
            >
              <span>01</span>
              <div>
                <strong>
                  Conference Schedule
                </strong>
                <small>
                  View sessions
                </small>
              </div>
              <b>→</b>
            </a>

            <Link
              to="/register"
              onClick={onClose}
              className={styles.resource}
            >
              <span>01</span>
              <div>
                <strong>
               Register for Certificate
                </strong>
                <small>
                 Apply for Virtual Certificate
                </small>
              </div>
              <b>→</b>
            </Link>

          </div>
        </div>

        {/* FOOTER */}

        <div className={styles.footer}>
          <Link
            to="/conference"
            onClick={onClose}
            className={styles.portalButton}
          >
            Enter Virtual Conference Portal
            <span>→</span>
          </Link>
        </div>

      {/* <PageNavigation/> */}
      </div>
    </div>
  );
}

export default ConferencePopup;