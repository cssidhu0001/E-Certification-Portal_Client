import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCandidates, updateCandidateStatus } from "../services/api";
import styles from "./AdminDashboard.module.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    try {
      await updateCandidateStatus(id, status, token);
      await loadCandidates();
    } catch (err) {
      setError(err.message);
    }
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
          <button onClick={loadCandidates}>Refresh</button>
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
                    <td>{candidate.certificateType}</td>
                    <td>
                      <span className={styles.status}>{candidate.status}</span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        {candidate.status !== "Approved" && (
                          <button onClick={() => changeStatus(candidate._id, "Approved")}>
                            Approve
                          </button>
                        )}
                        {candidate.status !== "Rejected" && (
                          <button
                            className={styles.reject}
                            onClick={() => changeStatus(candidate._id, "Rejected")}
                          >
                            Reject
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
