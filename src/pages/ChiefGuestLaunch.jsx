import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  launchProceedings,
  getProceedings,
} from "../services/api";
import styles from "./ChiefGuestLaunch.module.css";
import PageNavigation from "../components/PageNavigation";

function ChiefGuestLaunch() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [launching, setLaunching] = useState(false);
  const [launched, setLaunched] = useState(false);

  const [ceremony, setCeremony] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [completed, setCompleted] = useState(false);

  const [error, setError] = useState("");

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const checkProceedings = async () => {
      if (!token) {
        navigate("/admin/login");
        return;
      }

      try {
        const data = await getProceedings();

        const alreadyLaunched =
          Boolean(data?.proceedings?.launched);

        setLaunched(alreadyLaunched);

        /*
         * Agar proceedings pehle hi launch ho chuke hain,
         * to ceremony dobara automatically nahi chalegi.
         */
      } catch (err) {
        setError(
          err.message ||
            "Unable to load proceedings status."
        );
      } finally {
        setLoading(false);
      }
    };

    checkProceedings();
  }, [navigate, token]);

  const startCeremony = () => {
    setCeremony(true);
    setCompleted(false);
    setCountdown(3);

    // 3
    setTimeout(() => {
      setCountdown(2);
    }, 1000);

    // 2
    setTimeout(() => {
      setCountdown(1);
    }, 2000);

    // 1
    setTimeout(() => {
      setCountdown(0);
    }, 3000);

    /*
     * Curtain opening starts after countdown.
     * CSS handles the actual animation.
     */

    // After curtain has opened
    setTimeout(() => {
      setCompleted(true);
    }, 7000);
  };

  const handleLaunch = async () => {
    if (launching || launched) return;

    const confirmed = window.confirm(
      "Are you ready to launch the official IANETL 2026 Abstract Proceedings?"
    );

    if (!confirmed) return;

    try {
      setLaunching(true);
      setError("");

      const data = await launchProceedings(token);

      setLaunched(true);

      /*
       * IMPORTANT:
       * Ceremony starts ONLY after backend confirms
       * successful launch.
       *
       * It does NOT depend on Socket.IO.
       */
      startCeremony();

    } catch (err) {
      setError(
        err.message ||
          "Unable to launch Abstract Proceedings."
      );
    } finally {
      setLaunching(false);
    }
  };

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.loading}>
          Loading launch console...
        </div>
      </main>
    );
  }

  /*
   * -----------------------------------------
   * FINAL THANK YOU SCREEN
   * -----------------------------------------
   */

  if (completed) {
    return (
      <main className={styles.thankYouPage}>
        <div className={styles.thankYouGlow}></div>

        <section className={styles.thankYouContent}>

          <div className={styles.thankYouTop}>
            <span>IANETL 2026</span>
            <span>MIET KUMAON</span>
          </div>

          <div className={styles.checkCircle}>
            ✓
          </div>

          <span className={styles.thankYouLabel}>
            OFFICIAL PROCEEDINGS LAUNCHED
          </span>

          <h1>
            Thank You
            <br />
            for Launching the Proceedings
          </h1>

          <div className={styles.goldLine}></div>

          <p>
            The official Abstract Proceedings of
            <strong>
              {" "}IANETL 2026
            </strong>
            {" "}
            have now been successfully launched
            and made available to the conference
            audience.
          </p>

          <div className={styles.mietBox}>
            <strong>
              MIET KUMAON
            </strong>

            <span>
              College of Nursing
            </span>

            <span>
              Haldwani, Nainital
            </span>

            <small>
              1st International Conference
            </small>
          </div>

          <button
            type="button"
            className={styles.viewProceedingsButton}
            onClick={() =>
              navigate("/proceedings")
            }
          >
            View Proceedings
            <span>→</span>
          </button>

          <div className={styles.designedBy}>
            Designed &amp; Maintained by
            <strong> Techvirsa</strong>
          </div>

        </section>
      </main>
    );
  }

  /*
   * -----------------------------------------
   * CURTAIN CEREMONY
   * -----------------------------------------
   */

  if (ceremony) {
    return (
      <main className={styles.ceremonyPage}>

        <div className={styles.stage}>

          {/* Top heading */}
          <div className={styles.stageHeading}>
            <span>
              OFFICIAL LAUNCH CEREMONY
            </span>

            <h1>
              LAUNCH PROCEEDINGS
            </h1>

            <h2>
              IANETL 2026
            </h2>
          </div>

          {/* Stage light */}
          <div className={styles.stageLight}></div>

          {/* Center countdown */}
          {countdown > 0 && (
            <div className={styles.countdown}>
              {countdown}
            </div>
          )}

          {/* Behind curtain content */}
          <div className={styles.hiddenProceedings}>
            <span>
              MIET KUMAON
            </span>

            <h3>
              Abstract Proceedings
            </h3>

            <p>
              IANETL 2026
            </p>
          </div>

          {/* LEFT CURTAIN */}
          <div
            className={`${styles.curtain} ${
              styles.leftCurtain
            } ${
              countdown === 0
                ? styles.curtainOpenLeft
                : ""
            }`}
          >
            <div className={styles.curtainFold}></div>
          </div>

          {/* RIGHT CURTAIN */}
          <div
            className={`${styles.curtain} ${
              styles.rightCurtain
            } ${
              countdown === 0
                ? styles.curtainOpenRight
                : ""
            }`}
          >
            <div className={styles.curtainFold}></div>
          </div>

          {/* Curtain top rod */}
          <div className={styles.curtainRod}></div>

          {/* Bottom text */}
          <div className={styles.stageFooter}>
            MIET KUMAON • IANETL 2026
          </div>

        </div>
      </main>
    );
  }

  /*
   * -----------------------------------------
   * INITIAL CLOSED CURTAIN SCREEN
   * -----------------------------------------
   */

  return (
    <main className={styles.page}>

      <div className={styles.ceremonyBackground}></div>

      <section className={styles.closedStage}>

        <div className={styles.closedStageHeading}>
          <span>
            MIET KUMAON PRESENTS
          </span>

          <h1>
            LAUNCH PROCEEDINGS
          </h1>

          <h2>
            IANETL 2026
          </h2>

          <div className={styles.smallGoldLine}></div>

          <p>
            Official Abstract Proceedings
          </p>
        </div>

        {/* Closed curtains */}
        <div className={styles.closedCurtainLeft}></div>
        <div className={styles.closedCurtainRight}></div>

        <div className={styles.closedCurtainCenter}></div>

        {/* Launch button */}
        <div className={styles.launchConsole}>

          {!launched ? (
            <>
              <span className={styles.authorized}>
                CHIEF GUEST / AUTHORIZED OFFICIAL
              </span>

              <button
                type="button"
                className={styles.launchButton}
                onClick={handleLaunch}
                disabled={launching}
              >
                {launching
                  ? "Launching..."
                  : "Launch Proceedings"}
              </button>

              <small>
                The proceedings will be made
                publicly available after launch.
              </small>
            </>
          ) : (
            <div className={styles.alreadyLaunched}>
              <span>PROCEEDINGS ALREADY LAUNCHED</span>

              <button
                type="button"
                onClick={() =>
                  navigate("/proceedings")
                }
              >
                View Proceedings →
              </button>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

        </div>

        <div className={styles.closedFooter}>
          <span>MIET KUMAON</span>

          <span>
            Designed &amp; Maintained by Techvirsa
          </span>
        </div>

      </section>
<PageNavigation/>
    </main>
  );
}

export default ChiefGuestLaunch;