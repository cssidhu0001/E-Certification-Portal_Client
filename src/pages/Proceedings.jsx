import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";

import { getProceedings } from "../services/api";
import styles from "./Proceedings.module.css";
import PageNavigation from "../components/PageNavigation";

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

  const [timeLeft, setTimeLeft] = useState(null);

  const revealStarted = useRef(false);
  const revealTimers = useRef([]);

  /* ==========================================
     START CURTAIN REVEAL
  ========================================== */

  const startReveal = () => {
    if (revealStarted.current) {
      return;
    }

    revealStarted.current = true;

    revealTimers.current.forEach(clearTimeout);
    revealTimers.current = [];

    setRevealing(true);
    setRevealed(false);

    // 3
    setCountdown(3);

    const timer2 = setTimeout(() => {
      setCountdown(2);
    }, 1000);

    // 2 → 1
    const timer1 = setTimeout(() => {
      setCountdown(1);
    }, 2000);

    // Start curtain opening
    const timerOpening = setTimeout(() => {
      setCountdown(0);
    }, 3000);

    // Reveal live page
    const timerReveal = setTimeout(() => {
      setRevealed(true);
    }, 6500);

    // Finish ceremony
    const timerFinish = setTimeout(() => {
      setRevealing(false);
    }, 7200);

    revealTimers.current = [
      timer2,
      timer1,
      timerOpening,
      timerReveal,
      timerFinish,
    ];
  };

  /* ==========================================
     LOAD PROCEEDINGS
  ========================================== */

  useEffect(() => {
    let mounted = true;

    const loadProceedings = async () => {
      try {
        const data = await getProceedings();

        if (!mounted) {
          return;
        }

        const item = data?.proceedings;

        setProceedings(item);

        // Already launched → directly show proceedings
        if (item?.launched) {
          setRevealed(true);
          setRevealing(false);
          setTimeLeft(null);
        }
      } catch (error) {
        console.error("Proceedings load error:", error);
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

  /* ==========================================
     FRONTEND COUNTDOWN
     09 OCTOBER 2026 — 10:00 AM IST
  ========================================== */

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
        difference / (1000 * 60 * 60 * 24)
      );

      const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
      );

      const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
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

    updateCountdown();

    const interval = setInterval(
      updateCountdown,
      1000
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  /* ==========================================
     SOCKET.IO
  ========================================== */

  useEffect(() => {
    const socket = io(BACKEND_URL, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log(
        "Proceedings Socket connected:",
        socket.id
      );
    });

    socket.on("connect_error", (error) => {
      console.error(
        "Proceedings Socket error:",
        error.message
      );
    });

    socket.on("proceedings:launch", (data) => {
      console.log(
        "🔥 Proceedings launch received:",
        data
      );

      if (revealStarted.current) {
        return;
      }

      setProceedings((previous) => ({
        ...(previous || {}),
        ...(data || {}),
        launched: true,
      }));

      setTimeLeft(null);

      startReveal();
    });

    socket.on("disconnect", () => {
      console.log(
        "Proceedings Socket disconnected"
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  /* ==========================================
     CLEANUP
  ========================================== */

  useEffect(() => {
    return () => {
      revealTimers.current.forEach(clearTimeout);
      revealTimers.current = [];
    };
  }, []);

  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.loading}>
          Loading Abstract Proceedings...
        </div>
      </main>
    );
  }

  /* ==========================================
     LIVE STATE
  ========================================== */

  if (revealed && !revealing) {
    return (
      <main className={styles.livePage}>
        <div className={styles.liveGlow}></div>

        <section className={styles.liveContent}>

          {/* HEADER */}

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

          {/* LAUNCH STATUS */}

          {proceedings?.launchedAt && (
            <span className={styles.launchedAt}>
              Officially launched
            </span>
          )}

          {/* HEYZINE FLIPBOOK */}

          {proceedings?.heyzineUrl ? (
            <>
              <div className={styles.bookViewer}>
                <iframe
                  src={proceedings.heyzineUrl}
                  title="IANETL 2026 Abstract Proceedings"
                  allowFullScreen
                  allow="autoplay; fullscreen; clipboard-write"
                  scrolling="no"
                />
              </div>

              {/* ACTION BUTTONS */}

              <div className={styles.proceedingsActions}>

                {/* READ */}

                <a
                  href={proceedings.heyzineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.actionButton} ${styles.primaryButton}`}
                >
                  <span>📖</span>
                  Read Proceedings
                  <strong>↗</strong>
                </a>

                {/* DOWNLOAD */}

                <a
                  href="/proceedings.pdf"
                  download
                  className={styles.actionButton}
                >
                  <span>↓</span>
                  Download Proceedings
                </a>

                {/* BACK */}

                <button
                  type="button"
                  className={styles.actionButton}
                  onClick={() => window.history.back()}
                >
                  <span>←</span>
                  Back
                </button>

                {/* HOME */}

                <Link
                  to="/"
                  className={styles.actionButton}
                >
                  <span>⌂</span>
                  Home
                </Link>

              </div>
            </>
          ) : (
            <div className={styles.noLink}>
              Proceedings link will be available shortly.
            </div>
          )}

        </section>
      </main>
    );
  }

  /* ==========================================
     BEFORE LAUNCH / COMING SOON
  ========================================== */

  if (!revealing) {
    return (
      <main className={styles.comingPage}>
        <section className={styles.comingContent}>

          {/* EVENT INFORMATION */}

          <div className={styles.eventInfo}>
            <span>
              IANETL 2026
            </span>

            <strong>
              09–11 OCTOBER 2026
            </strong>

            <small>
              ABSTRACT PROCEEDINGS RELEASE
              {" • "}
              09 OCTOBER 2026
            </small>
          </div>

          {/* PAGE LABEL */}

          <span className={styles.comingLabel}>
            IANETL 2026
          </span>

          {/* TITLE */}

          <h1>
            Abstract
            <br />
            Proceedings
          </h1>

          <p>
            The official conference abstract
            proceedings will be unveiled here.
          </p>

          {/* COMING SOON */}

          <div className={styles.comingSoon}>
            COMING SOON
          </div>

          {/* COUNTDOWN */}

          {timeLeft && (
            <div className={styles.countdownWrapper}>

              {/* DAYS */}

              <div className={styles.countdownItem}>
                <strong>
                  {String(
                    timeLeft.days
                  ).padStart(2, "0")}
                </strong>

                <span>
                  DAYS
                </span>
              </div>

              <div
                className={
                  styles.countdownSeparator
                }
              >
                :
              </div>

              {/* HOURS */}

              <div className={styles.countdownItem}>
                <strong>
                  {String(
                    timeLeft.hours
                  ).padStart(2, "0")}
                </strong>

                <span>
                  HOURS
                </span>
              </div>

              <div
                className={
                  styles.countdownSeparator
                }
              >
                :
              </div>

              {/* MINUTES */}

              <div className={styles.countdownItem}>
                <strong>
                  {String(
                    timeLeft.minutes
                  ).padStart(2, "0")}
                </strong>

                <span>
                  MINUTES
                </span>
              </div>

              <div
                className={
                  styles.countdownSeparator
                }
              >
                :
              </div>

              {/* SECONDS */}

              <div className={styles.countdownItem}>
                <strong>
                  {String(
                    timeLeft.seconds
                  ).padStart(2, "0")}
                </strong>

                <span>
                  SECONDS
                </span>
              </div>

            </div>
          )}

        <PageNavigation/>
        </section>
      </main>
    );
  }

  /* ==========================================
     CURTAIN REVEAL CEREMONY
  ========================================== */

  return (
    <main className={styles.ceremonyPage}>

      <div
        className={`${styles.ceremonyStage} ${
          countdown === 0
            ? styles.stageOpening
            : ""
        }`}
      >

        {/* STAGE LIGHT */}

        <div className={styles.stageLight}></div>

        {/* CEREMONY TITLE */}

        <div className={styles.ceremonyTitle}>
          <span>
            IANETL 2026
          </span>

          <h1>
            Abstract Proceedings
          </h1>
        </div>

        {/* COUNTDOWN */}

        <div className={styles.countdown}>
          {countdown > 0 && countdown}
        </div>

        {/* LEFT CURTAIN */}

        <div
          className={`${styles.curtain} ${styles.curtainLeft}`}
        ></div>

        {/* RIGHT CURTAIN */}

        <div
          className={`${styles.curtain} ${styles.curtainRight}`}
        ></div>

        {/* CURTAIN ROD */}

        <div className={styles.curtainRod}></div>

        {/* BOTTOM LABEL */}

        <div className={styles.ceremonyBottom}>
          OFFICIAL PROCEEDINGS LAUNCH
        </div>

<PageNavigation/>
      </div>
    </main>
  );
}

export default Proceedings;