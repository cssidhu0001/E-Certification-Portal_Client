import { useState } from "react";
import PageShell from "../components/PageShell";
import {
  getCandidateStatus,
  downloadCertificate,
} from "../services/api";
import styles from "./Status.module.css";
import PageNavigation from "../components/PageNavigation";

function Status() {
  const [email, setEmail] = useState("");
  const [candidate, setCandidate] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // ==========================================
  // CHECK CERTIFICATE STATUS
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setCandidate(null);

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError("Please enter your registered email.");
      setLoading(false);
      return;
    }

    try {
      const data = await getCandidateStatus(cleanEmail);

      setCandidate(data.candidate);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DOWNLOAD CERTIFICATE
  // Common function from api.js
  // ==========================================
  const handleDownload = async () => {
    if (!candidate?.certificateUrl) {
      setError("Certificate download is not available yet.");
      return;
    }

    try {
      setDownloading(true);
      setError("");

      await downloadCertificate(
        candidate.certificateUrl,
        candidate.certificateId
      );
    } catch (err) {
      console.error("Download error:", err);

      setError(
        "Unable to download certificate. Please try again."
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <PageShell>
      <div className={styles.page}>
        {/* ==========================================
            HEADER
        ========================================== */}
        <header>
          <span>PARTICIPANT PORTAL</span>

          <h1>Certificate Status</h1>

          <p>
            Enter the email used during registration to check
            your status.
          </p>
        </header>

        {/* ==========================================
            SEARCH FORM
        ========================================== */}
        <form
          className={styles.search}
          onSubmit={handleSubmit}
        >
          <label>
            Registered Email

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Checking..."
              : "Check Status"}
          </button>
        </form>

        {/* ==========================================
            ERROR
        ========================================== */}
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {/* ==========================================
            CANDIDATE RESULT
        ========================================== */}
        {candidate && (
          <section className={styles.result}>
            <div className={styles.resultTop}>
              <div>
                <small>CANDIDATE</small>

                <h2>{candidate.name}</h2>

                <p>{candidate.email}</p>
              </div>

              <StatusBadge
                status={candidate.status}
              />
            </div>

            {/* DETAILS */}
            <div className={styles.details}>
              <div>
                <span>Participation</span>

                <strong>
                  {candidate.participationType ||
                    "Conference"}
                </strong>
              </div>

              <div>
                <span>Certificate ID</span>

                <strong>
                  {candidate.certificateId ||
                    "Not generated yet"}
                </strong>
              </div>

              <div>
                <span>Certificate Type</span>

                <strong>
                  {candidate.certificateType ||
                    "Participation"}
                </strong>
              </div>

              <div>
                <span>Event</span>

                <strong>
                  {candidate.eventName ||"1st International Conference - IANETL 2026"}
                </strong>
              </div>
            </div>

            {/* ==========================================
                DOWNLOAD
            ========================================== */}
            {candidate.status === "Approved" &&
              candidate.certificateUrl && (
                <button
                  type="button"
                  className={styles.download}
                  onClick={handleDownload}
                  disabled={downloading}
                >
                  {downloading
                    ? "Downloading..."
                    : "↓  Download Certificate"}
                </button>
              )}

            {/* Pending message */}
            {candidate.status === "Pending" && (
              <div className={styles.pendingMessage}>
                Your registration is currently under review.
                Your certificate will be available after
                approval.
              </div>
            )}

            {/* Rejected message */}
            {candidate.status === "Rejected" && (
              <div className={styles.rejectedMessage}>
                Your registration has not been approved.
                Please contact the conference team for
                further assistance.
              </div>
            )}
          </section>
        )}
      </div>
      <PageNavigation/>
    </PageShell>
  );
}


// ==========================================
// STATUS BADGE
// ==========================================
function StatusBadge({ status }) {
  const className = {
    Pending: styles.pending,
    Approved: styles.approved,
    Rejected: styles.rejected,
  }[status] || "";

  return (
    <span
      className={`${styles.badge} ${className}`}
    >
      {status}
    </span>
  );
}

export default Status;