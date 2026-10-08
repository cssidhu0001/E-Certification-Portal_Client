import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageShell from "../components/PageShell";
import {
  verifyCertificate,
  verifyCertificateManually,
  downloadCertificate,
} from "../services/api";
import styles from "./Verify.module.css";
import PageNavigation from "../components/PageNavigation";

function Verify() {
  const { certificateId } = useParams();

  // URL me certificateId hai = QR verification
  // /verify/:certificateId
  const isQRVerification = Boolean(certificateId);

  const [email, setEmail] = useState("");
  const [manualCertificateId, setManualCertificateId] = useState("");

  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // ==========================================
  // QR VERIFICATION
  // /verify/:certificateId
  // ==========================================
  useEffect(() => {
    if (!isQRVerification) {
      return;
    }

    const verifyQR = async () => {
      setLoading(true);
      setError("");
      setCertificate(null);

      try {
        const data = await verifyCertificate(certificateId);

        setCertificate(data.candidate);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    verifyQR();
  }, [certificateId, isQRVerification]);

  // ==========================================
  // MANUAL VERIFICATION
  // /verify
  // ==========================================
  const handleManualVerify = async (e) => {
    e.preventDefault();

    setError("");
    setCertificate(null);

    const cleanEmail = email.trim();
    const cleanCertificateId = manualCertificateId.trim();

    if (!cleanEmail || !cleanCertificateId) {
      setError("Please enter both Email and Certificate ID.");
      return;
    }

    setLoading(true);

    try {
      const data = await verifyCertificateManually(
        cleanEmail,
        cleanCertificateId
      );

      setCertificate(data.candidate);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DOWNLOAD CERTIFICATE
  // ==========================================
  const handleDownload = async () => {
    if (!certificate?.certificateUrl) {
      setError("Certificate download is not available.");
      return;
    }

    try {
      setDownloading(true);
      setError("");

      await downloadCertificate(
        certificate.certificateUrl,
        certificate.certificateId
      );
    } catch (err) {
      console.error("Download error:", err);
      setError("Unable to download certificate. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <PageShell>
      <div className={styles.page}>
        {/* ==========================================
            QR VERIFICATION
        ========================================== */}
        {isQRVerification ? (
          <>
            <div
              className={`${styles.icon} ${
                error ? styles.iconError : styles.iconSuccess
              }`}
            >
              {loading ? "..." : error ? "!" : certificate ? "✓" : "✓"}
            </div>

            <span className={styles.label}>
              QR CERTIFICATE VERIFICATION
            </span>

            <h1>
              {loading
                ? "Verifying Certificate..."
                : certificate
                  ? "Certificate Verified"
                  : "Certificate Verification"}
            </h1>

            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}

            {certificate && (
              <CertificateDetails
                certificate={certificate}
                onDownload={handleDownload}
                downloading={downloading}
              />
            )}
          </>
        ) : (
          /* ==========================================
             MANUAL VERIFICATION
          ========================================== */
          <>
            <div className={styles.icon}>✓</div>

            <span className={styles.label}>
              CERTIFICATE VERIFICATION
            </span>

            <h1>Verify Your Certificate</h1>

            <p className={styles.description}>
              Enter your registered email address and certificate
              ID to verify your certificate.
              <br />

              <span className={styles.caseNote}>
                Kindly make sure your Email ID and Certificate ID
                are entered correctly.
              </span>
            </p>

            <form
              className={styles.form}
              onSubmit={handleManualVerify}
            >
              {/* EMAIL */}
              <div className={styles.field}>
                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              {/* CERTIFICATE ID */}
              <div className={styles.field}>
                <label htmlFor="certificateId">
                  Certificate ID
                </label>

                <input
                  id="certificateId"
                  type="text"
                  placeholder="e.g. CONF-IANETL-2026-XK1SZJ"
                  value={manualCertificateId}
                  onChange={(e) =>
                    setManualCertificateId(e.target.value)
                  }
                  autoComplete="off"
                />
              </div>

              {/* ERROR */}
              {error && (
                <div className={styles.error}>
                  {error}
                </div>
              )}

              {/* VERIFY BUTTON */}
              <button
                type="submit"
                className={styles.verifyButton}
                disabled={loading}
              >
                {loading
                  ? "Verifying..."
                  : "Verify Certificate"}
              </button>
            </form>

            {/* VERIFIED RESULT */}
            {certificate && (
              <CertificateDetails
                certificate={certificate}
                onDownload={handleDownload}
                downloading={downloading}
              />
            )}
          </>
        )}
      </div>

      <PageNavigation />
    </PageShell>
  );
}


// ==========================================
// CERTIFICATE DETAILS
// ==========================================
function CertificateDetails({
  certificate,
  onDownload,
  downloading,
}) {
  return (
    <section className={styles.resultWrapper}>
      <section className={styles.card}>
        {/* CERTIFICATE ID */}
        <div>
          <span>Certificate ID</span>
          <strong>{certificate.certificateId}</strong>
        </div>

        {/* PARTICIPANT */}
        <div>
          <span>Participant</span>
          <strong>{certificate.name}</strong>
        </div>

        {/* EMAIL */}
        <div>
          <span>Email</span>
          <strong>{certificate.email}</strong>
        </div>

        {/* INSTITUTION */}
        <div>
          <span>Institution</span>
          <strong>{certificate.institution}</strong>
        </div>

        {/* DESIGNATION */}
        {certificate.designation && (
          <div>
            <span>Designation</span>
            <strong>{certificate.designation}</strong>
          </div>
        )}

        {/* CERTIFICATE TYPE */}
        <div>
          <span>Certificate Type</span>
          <strong>{certificate.certificateType}</strong>
        </div>

        {/* PARTICIPATION */}
        <div>
          <span>Participation</span>
          <strong>{certificate.participationType}</strong>
        </div>

        {/* EVENT */}
        <div>
          <span>Event</span>
          <strong>{certificate.eventName}</strong>
        </div>

        {/* VERIFIED BY */}
        {certificate.approvedBy && (
          <div>
            <span>Verified By</span>

            <strong>
              {certificate.approvedBy.name}
            </strong>

            {certificate.approvedBy.designation && (
              <small
                style={{
                  display: "block",
                  marginTop: "4px",
                  color: "#777",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                {certificate.approvedBy.designation}
              </small>
            )}
          </div>
        )}

        {/* APPROVED DATE */}
        {certificate.approvedAt && (
          <div>
            <span>Verified On</span>

            <strong>
              {new Date(
                certificate.approvedAt
              ).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </strong>
          </div>
        )}

        {/* STATUS */}
        <div>
          <span>Status</span>

          <strong className={styles.valid}>
            ✓ Valid Certificate
          </strong>
        </div>
      </section>

      {/* DOWNLOAD BUTTON */}
      {certificate.certificateUrl && (
        <button
          type="button"
          className={styles.downloadButton}
          onClick={onDownload}
          disabled={downloading}
        >
          <span>↓</span>

          {downloading
            ? "Downloading..."
            : "Download Certificate"}
        </button>
      )}
    </section>
  );
}

export default Verify;