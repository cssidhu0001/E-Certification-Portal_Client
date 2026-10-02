import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCandidates, updateCandidateStatus } from "../services/api";
import styles from "./AdminDashboard.module.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Action states
  const [actionLoading, setActionLoading] = useState(false);
  const [actionType, setActionType] = useState("");
  const [actionCandidate, setActionCandidate] = useState(null);

  // Success / error modal
  const [actionResult, setActionResult] = useState(null);

  const token = localStorage.getItem("adminToken");
  const admin = JSON.parse(localStorage.getItem("adminData") || "null");

  const loadCandidates = async () => {
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const data = await getCandidates(token);
      setCandidates(data.candidates || data.data || []);
    } catch (err) {
      setError(err.message);

      if (err.message.toLowerCase().includes("token")) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const changeStatus = async (id, status) => {
    // Prevent multiple actions at the same time
    if (actionLoading) return;

    const candidate = candidates.find((item) => item._id === id);

    setActionLoading(true);
    setActionType(status);
    setActionCandidate(candidate || null);
    setError("");
    setActionResult(null);

    try {
      const data = await updateCandidateStatus(id, status, token);

      // Refresh candidate list only after backend operation is complete
      await loadCandidates();

      if (status === "Approved") {
        const certificateId =
          data?.certificateId ||
          data?.candidate?.certificateId ||
          data?.data?.certificateId ||
          candidate?.certificateId ||
          "Generated Successfully";

        setActionResult({
          type: "approved",
          title: "Certificate Approved Successfully",
          certificateId,
        });
      } else {
        setActionResult({
          type: "rejected",
          title: "Certificate Rejected Successfully",
        });
      }
    } catch (err) {
      setActionResult({
        type: "error",
        title: "Action Failed",
        message:
          err.message ||
          `Unable to ${status.toLowerCase()} this certificate.`,
      });
    } finally {
      setActionLoading(false);
      setActionType("");
      setActionCandidate(null);
    }
  };

  const closeResultModal = () => {
    setActionResult(null);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    navigate("/admin/login");
  };

  const pending = candidates.filter((c) => c.status === "Pending").length;
  const approved = candidates.filter((c) => c.status === "Approved").length;
  const rejected = candidates.filter((c) => c.status === "Rejected").length;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <span>MIET KUMAON</span>
          <h1>Admin Dashboard</h1>
          <p>Welcome, {admin?.name || "Administrator"}</p>
        </div>

        <button onClick={logout}>Logout</button>
      </header>

      {error && <div className={styles.error}>{error}</div>}

      <section className={styles.stats}>
        <Stat label="Total" value={candidates.length} />
        <Stat label="Pending" value={pending} />
        <Stat label="Approved" value={approved} />
        <Stat label="Rejected" value={rejected} />
      </section>

      <section className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div>
            <h2>Candidate Registrations</h2>
            <p>Review and manage certificate approvals.</p>
          </div>

          <button onClick={loadCandidates} disabled={actionLoading}>
            Refresh
          </button>
        </div>

        {loading ? (
          <div className={styles.empty}>Loading candidates...</div>
        ) : candidates.length === 0 ? (
          <div className={styles.empty}>No candidates found.</div>
        ) : (
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Institution</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {candidates.map((candidate) => (
                  <tr key={candidate._id}>
                    <td>
                      <strong>{candidate.name}</strong>
                      <small>{candidate.email}</small>
                    </td>

                    <td>{candidate.institution}</td>

                    <td>
                      <strong>{candidate.certificateType}</strong>

                      {/* Show presentation title for Research Paper / Poster */}
                      {(candidate.certificateType === "Research Paper" ||
                        candidate.certificateType === "Poster") &&
                        candidate.presentationTitle && (
                          <small
                            style={{
                              display: "block",
                              marginTop: "6px",
                              lineHeight: "1.4",
                              maxWidth: "280px",
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                            }}
                          >
                            <strong>
                              {candidate.certificateType === "Research Paper"
                                ? "Paper: "
                                : "Poster: "}
                            </strong>
                            {candidate.presentationTitle}
                          </small>
                        )}
                    </td>

                    <td>
                      <span className={styles.status}>
                        {candidate.status}
                      </span>
                    </td>

                    <td>
                      <div className={styles.actions}>
                        {candidate.status !== "Approved" && (
                          <button
                            onClick={() =>
                              changeStatus(candidate._id, "Approved")
                            }
                            disabled={actionLoading}
                            className={
                              actionLoading &&
                              actionCandidate?._id === candidate._id &&
                              actionType === "Approved"
                                ? styles.processingButton
                                : ""
                            }
                          >
                            {actionLoading &&
                            actionCandidate?._id === candidate._id &&
                            actionType === "Approved" ? (
                              <>
                                <span className={styles.buttonSpinner}></span>
                                Approving...
                              </>
                            ) : (
                              "Approve"
                            )}
                          </button>
                        )}

                        {candidate.status !== "Rejected" && (
                          <button
                            className={styles.reject}
                            onClick={() =>
                              changeStatus(candidate._id, "Rejected")
                            }
                            disabled={actionLoading}
                          >
                            {actionLoading &&
                            actionCandidate?._id === candidate._id &&
                            actionType === "Rejected" ? (
                              <>
                                <span className={styles.buttonSpinner}></span>
                                Rejecting...
                              </>
                            ) : (
                              "Reject"
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* PROCESSING MODAL */}
      {actionLoading && (
        <div className={styles.modalOverlay}>
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
          >
            <div className={styles.spinner}></div>

            <span className={styles.modalLabel}>
              {actionType === "Approved"
                ? "CERTIFICATE APPROVAL"
                : "CERTIFICATE REJECTION"}
            </span>

            <h2>
              {actionType === "Approved"
                ? "Approving Certificate"
                : "Rejecting Certificate"}
            </h2>

            <p>
              {actionType === "Approved"
                ? "Please wait while the certificate is being approved and generated."
                : "Please wait while the certificate registration is being rejected."}
            </p>

            {actionType === "Approved" && (
              <span className={styles.processingNote}>
                Certificate generation may take a few moments.
              </span>
            )}

            {actionCandidate?.name && (
              <div className={styles.processingCandidate}>
                <strong>{actionCandidate.name}</strong>
                <span>{actionCandidate.email}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUCCESS / ERROR MODAL */}
      {actionResult && !actionLoading && (
        <div className={styles.modalOverlay}>
          <div
            className={`${styles.modal} ${
              actionResult.type === "error"
                ? styles.errorModal
                : styles.successModal
            }`}
            role={actionResult.type === "error" ? "alertdialog" : "dialog"}
            aria-modal="true"
          >
            {actionResult.type === "error" ? (
              <>
                <div className={styles.errorIcon}>!</div>

                <span className={styles.modalLabel}>
                  ACTION FAILED
                </span>

                <h2>{actionResult.title}</h2>

                <p className={styles.resultMessage}>
                  {actionResult.message}
                </p>

                <button
                  type="button"
                  className={styles.resultButton}
                  onClick={closeResultModal}
                >
                  Try Again
                </button>
              </>
            ) : actionResult.type === "approved" ? (
              <>
                <div className={styles.successIcon}>✓</div>

                <span className={styles.modalLabel}>
                  APPROVAL COMPLETE
                </span>

                <h2>Certificate Approved Successfully</h2>

                <div className={styles.certificateIdBox}>
                  <span>Certificate ID</span>
                  <strong>{actionResult.certificateId}</strong>
                </div>

                <button
                  type="button"
                  className={styles.resultButton}
                  onClick={closeResultModal}
                >
                  Done
                </button>
              </>
            ) : (
              <>
                <div className={styles.successIcon}>✓</div>

                <span className={styles.modalLabel}>
                  REJECTION COMPLETE
                </span>

                <h2>Certificate Rejected Successfully</h2>

                <button
                  type="button"
                  className={styles.resultButton}
                  onClick={closeResultModal}
                >
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function Stat({ label, value }) {
  return (
    <div className={styles.stat}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default AdminDashboard;