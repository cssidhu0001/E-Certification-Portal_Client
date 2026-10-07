import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

import { getProceedings } from "../services/api";

import styles from "./Proceedings.module.css";

const BACKEND_URL = import.meta.env.VITE_API_URL.replace(
  /\/api$/,
  ""
);

function Proceedings() {
  const [proceedings, setProceedings] = useState(null);

  const [loading, setLoading] = useState(true);

  const [revealing, setRevealing] = useState(false);

  const [countdown, setCountdown] = useState(null);

  const [revealed, setRevealed] = useState(false);

  // Coming Soon countdown
  const [timeLeft, setTimeLeft] = useState(null);

  const revealStarted = useRef(false);

  /*
   * ==========================================
   * START CURTAIN REVEAL
   * ==========================================
   */

  const startReveal = () => {
    if (revealStarted.current) return;

    revealStarted.current = true;

    setRevealing(true);
    setRevealed(false);

    // 3
    setCountdown(3);

    // 2
    setTimeout(() => {
      setCountdown(2);
    }, 1000);

    // 1
    setTimeout(() => {
      setCountdown(1);
    }, 2000);

    // Start curtain opening
    setTimeout(() => {
      setCountdown(0);
    }, 3000);

    /*
     * Curtain animation takes around 4 seconds.
     */

    setTimeout(() => {
      setRevealed(true);
    }, 6500);

    setTimeout(() => {
      setRevealing(false);
    }, 7200);
  };

  /*
   * ==========================================
   * LOAD PROCEEDINGS
   * ==========================================
   */

  useEffect(() => {
    let mounted = true;

    const loadProceedings = async () => {
      try {
        const data = await getProceedings();

        if (!mounted) return;

        const item = data?.proceedings;

        setProceedings(item);

        /*
         * If proceedings were already launched
         * before this user opened the page,
         * directly show the live page.
         *
         * No curtain animation.
         */

        if (item?.launched) {
          setRevealed(true);
        }
      } catch (error) {
        console.error(
          "Proceedings load error:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProceedings();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * ==========================================
   * COMING SOON COUNTDOWN
   * ==========================================
   *
   * FRONTEND ONLY
   *
   * 09 October 2026
   * 10:00 AM IST
   *
   * No backend launchDate used.
   */

  useEffect(() => {
    const targetTime = new Date(
      "2026-10-09T10:00:00+05:30"
    ).getTime();

    const updateCountdown = () => {
      const difference = targetTime - Date.now();

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        return;
      }

      const days = Math.floor(
        difference /
          (1000 * 60 * 60 * 24)
      );

      const hours = Math.floor(
        (difference /
          (1000 * 60 * 60)) %
          24
      );

      const minutes = Math.floor(
        (difference /
          (1000 * 60)) %
          60
      );

      const seconds = Math.floor(
        (difference / 1000) % 60
      );

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
      });
    };

    // Run immediately
    updateCountdown();

    // Update every second
    const interval = setInterval(
      updateCountdown,
      1000
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  /*
   * ==========================================
   * SOCKET.IO
   * ==========================================
   */

  useEffect(() => {
    const socket = io(BACKEND_URL, {
      transports: [
        "websocket",
        "polling",
      ],
    });

    socket.on("connect", () => {
      console.log(
        "Proceedings Socket connected:",
        socket.id
      );
    });

    socket.on(
      "connect_error",
      (error) => {
        console.error(
          "Proceedings Socket error:",
          error.message
        );
      }
    );

    /*
     * Chief Guest launches proceedings.
     * All currently connected users receive
     * this event.
     */

    socket.on(
      "proceedings:launch",
      (data) => {
        console.log(
          "🔥 Proceedings launch received:",
          data
        );

        if (revealStarted.current) {
          return;
        }

        setProceedings((previous) => ({
          ...previous,
          ...data,
          launched: true,
        }));

        /*
         * Remove Coming Soon countdown
         */

        setTimeLeft(null);

        /*
         * Start local curtain ceremony.
         *
         * Animation is independent from the
         * Socket connection after this point.
         */

        startReveal();
      }
    );

    socket.on("disconnect", () => {
      console.log(
        "Proceedings Socket disconnected"
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  /*
   * ==========================================
   * LOADING
   * ==========================================
   */

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.loading}>
          Loading Abstract Proceedings...
        </div>
      </main>
    );
  }

  /*
   * ==========================================
   * LIVE STATE
   * ==========================================
   *
   * Already launched users directly see
   * the proceedings page.
   */

  if (revealed && !revealing) {
    return (
      <main className={styles.livePage}>
        <div className={styles.liveGlow}></div>

        <section className={styles.liveContent}>
          <span className={styles.liveLabel}>
            ABSTRACT PROCEEDINGS
          </span>

          <div className={styles.liveLine}></div>

          <h1>
            Abstract Proceedings
            <br />
            Now Live
          </h1>

          <p>
            The official IANETL 2026 Abstract
            Proceedings are now available for
            public viewing.
          </p>

          {proceedings?.heyzineUrl ? (
            <a
              href={proceedings.heyzineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.readButton}
            >
              Read Abstract Proceedings
              <span>→</span>
            </a>
          ) : (
            <div className={styles.noLink}>
              Proceedings link will be available
              shortly.
            </div>
          )}

          {proceedings?.launchedAt && (
            <span className={styles.launchedAt}>
              Officially launched
            </span>
          )}
        </section>
      </main>
    );
  }

  /*
   * ==========================================
   * BEFORE LAUNCH / COMING SOON
   * ==========================================
   */

 if (!revealing) {
  return (
    <main className={styles.comingPage}>
      <section className={styles.comingContent}>

        <div className={styles.eventInfo}>
          <span>IANETL 2026</span>

          <strong>
            09–11 OCTOBER 2026
          </strong>

          <small>
            ABSTRACT PROCEEDINGS RELEASE • 09 OCTOBER 2026
          </small>
        </div>

        <span className={styles.comingLabel}>
          IANETL 2026
        </span>

        <h1>
          Abstract
          <br />
          Proceedings
        </h1>

        <p>
          The official conference abstract
          proceedings will be unveiled here.
        </p>

        <div className={styles.comingSoon}>
          COMING SOON
        </div>

        {timeLeft && (
          <div className={styles.countdownWrapper}>
            <div className={styles.countdownItem}>
              <strong>
                {String(timeLeft.days).padStart(2, "0")}
              </strong>
              <span>DAYS</span>
            </div>

            <div className={styles.countdownSeparator}>
              :
            </div>

            <div className={styles.countdownItem}>
              <strong>
                {String(timeLeft.hours).padStart(2, "0")}
              </strong>
              <span>HOURS</span>
            </div>

            <div className={styles.countdownSeparator}>
              :
            </div>

            <div className={styles.countdownItem}>
              <strong>
                {String(timeLeft.minutes).padStart(2, "0")}
              </strong>
              <span>MINUTES</span>
            </div>

            <div className={styles.countdownSeparator}>
              :
            </div>

            <div className={styles.countdownItem}>
              <strong>
                {String(timeLeft.seconds).padStart(2, "0")}
              </strong>
              <span>SECONDS</span>
            </div>
          </div>
        )}

      </section>
    </main>
  );
}
  /*
   * ==========================================
   * CURTAIN REVEAL
   * ==========================================
   */

  return (
    <main className={styles.ceremonyPage}>
      <div
        className={`${styles.ceremonyStage} ${
          countdown === 0
            ? styles.stageOpening
            : ""
        }`}
      >
        <div className={styles.stageLight}></div>

        <div className={styles.ceremonyTitle}>
          <span>
            IANETL 2026
          </span>

          <h1>
            Abstract Proceedings
          </h1>
        </div>

        <div className={styles.countdown}>
          {countdown > 0 && countdown}
        </div>

        <div
          className={`${styles.curtain} ${styles.curtainLeft}`}
        ></div>

        <div
          className={`${styles.curtain} ${styles.curtainRight}`}
        ></div>

        <div className={styles.curtainRod}></div>

        <div className={styles.ceremonyBottom}>
          OFFICIAL PROCEEDINGS LAUNCH
        </div>
      </div>
    </main>
  );
}

export default Proceedings;