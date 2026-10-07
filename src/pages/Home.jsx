import { useState } from "react";
import ConferencePopup from "../components/ConferencePopup";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import styles from "./Home.module.css";


function Home() {
  const [conferenceOpen, setConferenceOpen] = useState(true);
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
            src="/Nursing-flyer.png"
            alt="IANETL 2026 conference poster"
          />
        </div>
      </section>



<div className={styles.virtualConferenceSection}>
  <button
    type="button"
    className={styles.virtualConferenceCard}
    onClick={() => setConferenceOpen(true)}
  >
    <div className={styles.virtualConferenceContent}>

      <div className={styles.virtualConferenceLabel}>
        <span className={styles.liveIndicator}></span>
        VIRTUAL CONFERENCE
      </div>

      <h2>
        Join the IANETL 2026 Virtual Conference
      </h2>

      <p>
        Access live presentations, conference sessions,
        Google Meet, YouTube & Facebook Live and
        important conference resources.
      </p>
    </div>

    <div className={styles.virtualConferenceArrow}>
      →
    </div>
  </button>
</div>





<section className={styles.liveSessionSection}>
  <div className={styles.liveSessionCard}>

    <div className={styles.liveSessionContent}>

      <div className={styles.liveSessionLabel}>
        <span className={styles.liveDot}></span>
        LIVE SESSION
      </div>

      <h2>Watch IANETL 2026 Live</h2>

      <p>
        Follow the conference live online through YouTube
        and Facebook.
      </p>

      <div className={styles.liveActions}>
        <a
          href="YOUR_YOUTUBE_LIVE_LINK"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.youtubeButton}
        >
          ▶&nbsp; Watch on YouTube
        </a>

        <a
          href="YOUR_FACEBOOK_LIVE_LINK"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.facebookButton}
        >
          f&nbsp;&nbsp; Watch on Facebook
        </a>
      </div>

    </div>

    <div className={styles.liveSessionSide}>
      <span>LIVE</span>
      <strong>ONLINE</strong>
    </div>

  </div>
</section>





<section className={styles.proceedingsSection}>

  <div className={styles.proceedingsCard}>

    <div>
      <div className={styles.proceedingsLabel}>
        IANETL 2026 · PUBLICATION
      </div>

      <h2>
        Abstract Proceedings
      </h2>

      <p>
        Explore the official collection of abstracts
        presented during the 3-Day International Conference.
      </p>
    </div>

    <Link
      to="/proceedings"
      className={styles.proceedingsButton}
    >
      View Proceedings →
    </Link>

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

   

      {/* QUERY / SUPPORT SECTION */}
      <section className={styles.support}>
        <div className={styles.supportContent}>
          <span className={styles.supportLabel}>NEED ASSISTANCE?</span>

          <h2>
            Have a query regarding your
            <span>certificate or registration?</span>
          </h2>

          <p>
            For any queries related to certificates, registration, verification
            or other conference-related matters, kindly reach out to us.
          </p>

          <a
            href="mailto:nursingconference@mietkumaon.ac.in"
            className={styles.email}
          >
            nursingconference@mietkumaon.ac.in
          </a>

          <Link to="/contact" className={styles.contactButton}>
            Contact Us →
          </Link>
        </div>
      </section>

      {/* FOOTER CREDIT */}
      <footer className={styles.footer}>
        <span>© 2026 IANETL Conference. All rights reserved.</span>

        <span className={styles.credit}>
          Designed &amp; Maintained by{" "}
          <a
            href="https://charanjeetsinghsidhu.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Techvirsa
          </a>
        </span>
      </footer>
      <ConferencePopup
  isOpen={conferenceOpen}
  onClose={() => setConferenceOpen(false)}
/>
    </PageShell>
    
  );
}

export default Home;