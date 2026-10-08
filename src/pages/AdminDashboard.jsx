import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  getCandidates,
  updateCandidateStatus,
  launchProceedings,
} from "../services/api";

import styles from "./AdminDashboard.module.css";
import PageNavigation from "../components/PageNavigation";

function AdminDashboard() {
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Candidate action states
  const [actionLoading, setActionLoading] = useState(false);
  const [actionType, setActionType] = useState("");
  const [actionCandidate, setActionCandidate] = useState(null);

  // Success / error modal
  const [actionResult, setActionResult] = useState(null);

  // Proceedings
  const [proceedingsLaunching, setProceedingsLaunching] =
    useState(false);

  const [proceedingsMessage, setProceedingsMessage] =
    useState("");

  const [proceedingsError, setProceedingsError] =
    useState("");

  const token = localStorage.getItem("adminToken");

  const admin = JSON.parse(
    localStorage.getItem("adminData") || "null"
  );

  // ==============================
  // LOAD CANDIDATES
  // ==============================

  const loadCandidates = async () => {
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getCandidates(token);

      setCandidates(
        data.candidates || data.data || []
      );
    } catch (err) {
      setError(err.message);

      if (
        err.message
          .toLowerCase()
          .includes("token")
      ) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");

        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  // ==============================
  // APPROVE / REJECT CANDIDATE
  // ==============================

  const changeStatus = async (id, status) => {
    if (
      actionLoading ||
      proceedingsLaunching
    ) {
      return;
    }

    const candidate = candidates.find(
      (item) => item._id === id
    );

    setActionLoading(true);
    setActionType(status);
    setActionCandidate(
      candidate || null
    );

    setError("");
    setActionResult(null);

    try {
      const data =
        await updateCandidateStatus(
          id,
          status,
          token
        );

      // Refresh candidate list only after
      // backend operation is complete
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
          title:
            "Certificate Approved Successfully",
          certificateId,
        });
      } else {
        setActionResult({
          type: "rejected",
          title:
            "Certificate Rejected Successfully",
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

  // ==============================
  // LAUNCH ABSTRACT PROCEEDINGS
  // ==============================

  const handleLaunchProceedings =
    async () => {
      if (
        proceedingsLaunching ||
        actionLoading
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          "Launch Abstract Proceedings now?\n\n" +
            "Once launched, the proceedings will become publicly available " +
            "and the live curtain-opening ceremony will be triggered for " +
            "users currently viewing the proceedings page."
        );

      if (!confirmed) return;

      try {
        setProceedingsLaunching(true);
        setProceedingsMessage("");
        setProceedingsError("");

        const adminToken =
          localStorage.getItem(
            "adminToken"
          );

        if (!adminToken) {
          navigate("/admin/login");
          return;
        }

        const data =
          await launchProceedings(
            adminToken
          );

        setProceedingsMessage(
          data?.message ||
            "Abstract Proceedings launched successfully."
        );
      } catch (err) {
        const message =
          err?.message ||
          "Unable to launch Abstract Proceedings.";

        setProceedingsError(message);
      } finally {
        setProceedingsLaunching(false);
      }
    };

  // ==============================
  // CLOSE RESULT MODAL
  // ==============================

  const closeResultModal = () => {
    setActionResult(null);
  };

  // ==============================
  // LOGOUT
  // ==============================

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");

    navigate("/admin/login");
  };

  // ==============================
  // STATISTICS
  // ==============================

  const pending =
    candidates.filter(
      (c) => c.status === "Pending"
    ).length;

  const approved =
    candidates.filter(
      (c) => c.status === "Approved"
    ).length;

  const rejected =
    candidates.filter(
      (c) => c.status === "Rejected"
    ).length;

  // ==============================
  // UI
  // ==============================

  return (
    <main className={styles.page}>
      {/* =========================
          HEADER
      ========================== */}

      <header className={styles.header}>
        <div>
          <span>MIET KUMAON</span>

          <h1>Admin Dashboard</h1>

          <p>
            Welcome,{" "}
            {admin?.name ||
              "Administrator"}
          </p>
        </div>

        <div
          className={
            styles.headerActions
          }
        >
          <Link
            to="/admin/export"
            className={
              styles.exportLink
            }
          >
            Export Center →
          </Link>

          <button onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* =========================
          ERROR
      ========================== */}

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {/* =========================
          ABSTRACT PROCEEDINGS
      ========================== */}

      <section
        className={
          styles.proceedingsCard
        }
      >
        <div
          className={
            styles.proceedingsInfo
          }
        >
          <span
            className={
              styles.proceedingsLabel
            }
          >
            PUBLICATION LAUNCH
          </span>

          <h2>
            Abstract Proceedings
          </h2>

          <p>
            Launch the official IANETL
            2026 Abstract Proceedings
            for public viewing.
          </p>
        </div>

        <div
          className={
            styles.proceedingsAction
          }
        >
          <button
            type="button"
            className={
              styles.launchProceedingsButton
            }
            onClick={() =>
              navigate(
                "/admin/proceedings-launch"
              )
            }
          >
            🎬 Open Launch Console →
          </button>

          {proceedingsMessage && (
            <div
              className={
                styles.proceedingsSuccess
              }
            >
              {proceedingsMessage}
            </div>
          )}

          {proceedingsError && (
            <div
              className={
                styles.proceedingsError
              }
            >
              {proceedingsError}
            </div>
          )}
        </div>
      </section>

      {/* =========================
          STATS
      ========================== */}

      <section className={styles.stats}>
        <Stat
          label="Total"
          value={candidates.length}
        />

        <Stat
          label="Pending"
          value={pending}
        />

        <Stat
          label="Approved"
          value={approved}
        />

        <Stat
          label="Rejected"
          value={rejected}
        />
      </section>

      {/* =========================
          CANDIDATE TABLE
      ========================== */}

      <section
        className={styles.tableCard}
      >
        <div
          className={
            styles.tableHeader
          }
        >
          <div>
            <h2>
              Candidate Registrations
            </h2>

            <p>
              Review and manage
              certificate approvals.
            </p>
          </div>

          <button
            onClick={loadCandidates}
            disabled={
              actionLoading ||
              proceedingsLaunching
            }
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className={styles.empty}>
            Loading candidates...
          </div>
        ) : candidates.length ===
          0 ? (
          <div className={styles.empty}>
            No candidates found.
          </div>
        ) : (
          <div
            className={
              styles.tableWrap
            }
          >
            <table>
              <thead>
                <tr>
                  <th>Name</th>

                  <th>
                    Institution
                  </th>

                  <th>Type</th>

                  <th>Status</th>

                  <th>
                    Approved By
                  </th>

                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {candidates.map(
                  (candidate) => (
                    <tr
                      key={
                        candidate._id
                      }
                    >
                      {/* NAME */}
                      <td>
                        <strong>
                          {
                            candidate.name
                          }
                        </strong>

                        <small>
                          {
                            candidate.email
                          }
                        </small>
                      </td>

                      {/* INSTITUTION */}
                      <td>
                        {
                          candidate.institution
                        }
                      </td>

                      {/* TYPE */}
                      <td>
                        <strong>
                          {
                            candidate.certificateType
                          }
                        </strong>

                        {/* Research Paper / Poster title */}
                        {(
                          candidate.certificateType ===
                            "Research Paper" ||
                          candidate.certificateType ===
                            "Poster"
                        ) &&
                          candidate.presentationTitle && (
                            <small
                              style={{
                                display:
                                  "block",
                                marginTop:
                                  "6px",
                                lineHeight:
                                  "1.4",
                                maxWidth:
                                  "280px",
                                whiteSpace:
                                  "normal",
                                wordBreak:
                                  "break-word",
                              }}
                            >
                              <strong>
                                {candidate.certificateType ===
                                "Research Paper"
                                  ? "Paper: "
                                  : "Poster: "}
                              </strong>

                              {
                                candidate.presentationTitle
                              }
                            </small>
                          )}
                      </td>

                      {/* STATUS */}
                      <td>
                        <span
                          className={
                            styles.status
                          }
                        >
                          {
                            candidate.status
                          }
                        </span>
                      </td>

                      {/* =========================
                          APPROVED BY
                      ========================== */}
                      <td>
                        {candidate.approvedBy ? (
                          <div
                            style={{
                              display:
                                "flex",
                              flexDirection:
                                "column",
                              gap: "4px",
                            }}
                          >
                            <strong>
                              {
                                candidate
                                  .approvedBy
                                  .name
                              }
                            </strong>

                            {candidate
                              .approvedBy
                              .designation && (
                              <small
                                style={{
                                  color:
                                    "#777",
                                  lineHeight:
                                    "1.4",
                                }}
                              >
                                {
                                  candidate
                                    .approvedBy
                                    .designation
                                }
                              </small>
                            )}
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>

                      {/* ACTION */}
                      <td>
                        <div
                          className={
                            styles.actions
                          }
                        >
                          {/* APPROVE */}
                          {candidate.status !==
                            "Approved" && (
                            <button
                              onClick={() =>
                                changeStatus(
                                  candidate._id,
                                  "Approved"
                                )
                              }
                              disabled={
                                actionLoading ||
                                proceedingsLaunching
                              }
                              className={
                                actionLoading &&
                                actionCandidate?._id ===
                                  candidate._id &&
                                actionType ===
                                  "Approved"
                                  ? styles.processingButton
                                  : ""
                              }
                            >
                              {actionLoading &&
                              actionCandidate?._id ===
                                candidate._id &&
                              actionType ===
                                "Approved" ? (
                                <>
                                  <span
                                    className={
                                      styles.buttonSpinner
                                    }
                                  ></span>

                                  Approving...
                                </>
                              ) : (
                                "Approve"
                              )}
                            </button>
                          )}

                          {/* REJECT */}
                          {candidate.status !==
                            "Rejected" && (
                            <button
                              className={
                                styles.reject
                              }
                              onClick={() =>
                                changeStatus(
                                  candidate._id,
                                  "Rejected"
                                )
                              }
                              disabled={
                                actionLoading ||
                                proceedingsLaunching
                              }
                            >
                              {actionLoading &&
                              actionCandidate?._id ===
                                candidate._id &&
                              actionType ===
                                "Rejected" ? (
                                <>
                                  <span
                                    className={
                                      styles.buttonSpinner
                                    }
                                  ></span>

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
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <PageNavigation />

      {/* =========================
          PROCESSING MODAL
      ========================== */}

      {actionLoading && (
        <div
          className={
            styles.modalOverlay
          }
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
          >
            <div
              className={styles.spinner}
            ></div>

            <span
              className={
                styles.modalLabel
              }
            >
              {actionType ===
              "Approved"
                ? "CERTIFICATE APPROVAL"
                : "CERTIFICATE REJECTION"}
            </span>

            <h2>
              {actionType ===
              "Approved"
                ? "Approving Certificate"
                : "Rejecting Certificate"}
            </h2>

            <p>
              {actionType ===
              "Approved"
                ? "Please wait while the certificate is being approved and generated."
                : "Please wait while the certificate registration is being rejected."}
            </p>

            {actionType ===
              "Approved" && (
              <span
                className={
                  styles.processingNote
                }
              >
                Certificate generation
                may take a few moments.
              </span>
            )}

            {actionCandidate?.name && (
              <div
                className={
                  styles.processingCandidate
                }
              >
                <strong>
                  {
                    actionCandidate.name
                  }
                </strong>

                <span>
                  {
                    actionCandidate.email
                  }
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================
          SUCCESS / ERROR MODAL
      ========================== */}

      {actionResult &&
        !actionLoading && (
          <div
            className={
              styles.modalOverlay
            }
          >
            <div
              className={`${styles.modal} ${
                actionResult.type ===
                "error"
                  ? styles.errorModal
                  : styles.successModal
              }`}
              role={
                actionResult.type ===
                "error"
                  ? "alertdialog"
                  : "dialog"
              }
              aria-modal="true"
            >
              {/* ERROR */}
              {actionResult.type ===
              "error" ? (
                <>
                  <div
                    className={
                      styles.errorIcon
                    }
                  >
                    !
                  </div>

                  <span
                    className={
                      styles.modalLabel
                    }
                  >
                    ACTION FAILED
                  </span>

                  <h2>
                    {
                      actionResult.title
                    }
                  </h2>

                  <p
                    className={
                      styles.resultMessage
                    }
                  >
                    {
                      actionResult.message
                    }
                  </p>

                  <button
                    type="button"
                    className={
                      styles.resultButton
                    }
                    onClick={
                      closeResultModal
                    }
                  >
                    Try Again
                  </button>
                </>
              ) : actionResult.type ===
                "approved" ? (
                <>
                  <div
                    className={
                      styles.successIcon
                    }
                  >
                    ✓
                  </div>

                  <span
                    className={
                      styles.modalLabel
                    }
                  >
                    APPROVAL COMPLETE
                  </span>

                  <h2>
                    Certificate Approved
                    Successfully
                  </h2>

                  <div
                    className={
                      styles.certificateIdBox
                    }
                  >
                    <span>
                      Certificate ID
                    </span>

                    <strong>
                      {
                        actionResult.certificateId
                      }
                    </strong>
                  </div>

                  <button
                    type="button"
                    className={
                      styles.resultButton
                    }
                    onClick={
                      closeResultModal
                    }
                  >
                    Done
                  </button>
                </>
              ) : (
                <>
                  <div
                    className={
                      styles.successIcon
                    }
                  >
                    ✓
                  </div>

                  <span
                    className={
                      styles.modalLabel
                    }
                  >
                    REJECTION COMPLETE
                  </span>

                  <h2>
                    Certificate Rejected
                    Successfully
                  </h2>

                  <button
                    type="button"
                    className={
                      styles.resultButton
                    }
                    onClick={
                      closeResultModal
                    }
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


// ==============================
// STAT COMPONENT
// ==============================

function Stat({ label, value }) {
  return (
    <div className={styles.stat}>
      <span>{label}</span>

      <strong>{value}</strong>
    </div>
  );
}

export default AdminDashboard;