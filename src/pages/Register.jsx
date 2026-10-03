import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import { registerCandidate } from "../services/api";
import styles from "./Register.module.css";

const MAX_TITLE_LENGTH = 145;

const initialForm = {
  name: "",
  email: "",
  mobile: "",
  institution: "",
  designation: "",
  participationType: "Online",
  certificateType: "Delegate",
  presentationTitle: "",
  eventName: "1st International Conference - IANETL 2026",
};

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(5);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      let updatedValue = value;

      // Hard limit for presentation title
      if (name === "presentationTitle") {
        updatedValue = value.slice(0, MAX_TITLE_LENGTH);
      }

      return {
        ...prev,
        [name]: updatedValue,

        // Clear title when certificate type doesn't require it
        ...(name === "certificateType" &&
        value !== "Research Paper" &&
        value !== "Poster"
          ? { presentationTitle: "" }
          : {}),
      };
    });

    // Clear previous error while user is correcting the form
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiresTitle =
      form.certificateType === "Research Paper" ||
      form.certificateType === "Poster";

    const trimmedTitle = form.presentationTitle.trim();

    // Required title validation
    if (requiresTitle && !trimmedTitle) {
      setError(
        `Please enter the ${
          form.certificateType === "Research Paper"
            ? "Research Paper"
            : "Poster"
        } Title.`
      );
      return;
    }

    // Maximum title length validation
    if (requiresTitle && trimmedTitle.length > MAX_TITLE_LENGTH) {
      setError(
        `The ${form.certificateType === "Research Paper" ? "Research Paper" : "Poster"} Title must not exceed ${MAX_TITLE_LENGTH} characters, including spaces.`
      );
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      // Send trimmed title to backend
      const submissionData = {
        ...form,
        presentationTitle: requiresTitle ? trimmedTitle : "",
      };

      const data = await registerCandidate(submissionData);

      setResult(data);
      setForm(initialForm);
      setCountdown(5);
    } catch (err) {
      setError(err.message || "Unable to complete registration.");
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS -> AUTO REDIRECT AFTER 5 SECONDS
  useEffect(() => {
    if (!result) {
      return;
    }

    if (countdown <= 0) {
      navigate("/");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [result, countdown, navigate]);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleCheckStatus = () => {
    navigate("/status");
  };

  const handleCloseError = () => {
    setError("");
  };

  const showPresentationTitle =
    form.certificateType === "Research Paper" ||
    form.certificateType === "Poster";

  const presentationLabel =
    form.certificateType === "Research Paper"
      ? "Research Paper Title"
      : "Poster Title";

  const presentationPlaceholder =
    form.certificateType === "Research Paper"
      ? "Enter your research paper title"
      : "Enter your poster title";

  const titleCharacterCount = form.presentationTitle.length;

  return (
    <PageShell>
      <div className={styles.page}>
        <header className={styles.header}>
          <span>IANETL 2026</span>

          <h1>Conference Registration</h1>

          <p>
            Enter your details carefully. Your registration will be reviewed
            by the conference administration before certificate approval.
          </p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* PERSONAL INFORMATION */}
          <section className={styles.section}>
            <div className={styles.sectionTitle}>
              <span>01</span>

              <div>
                <h2>Personal Information</h2>
                <p>Basic details of the participant.</p>
              </div>
            </div>

            <div className={styles.grid}>
              <Field
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                full
              />

              <Field
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />

              <Field
                label="Mobile Number"
                name="mobile"
                type="tel"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Enter mobile number"
                required
              />
            </div>
          </section>

          {/* PROFESSIONAL INFORMATION */}
          <section className={styles.section}>
            <div className={styles.sectionTitle}>
              <span>02</span>

              <div>
                <h2>Professional Information</h2>
                <p>Institution and designation details.</p>
              </div>
            </div>

            <div className={styles.grid}>
              <Field
                label="Institution / Organization"
                name="institution"
                value={form.institution}
                onChange={handleChange}
                placeholder="College / University / Organization"
                required
              />

              <Field
                label="Designation"
                name="designation"
                value={form.designation}
                onChange={handleChange}
                placeholder="Student / Faculty / Researcher"
              />
            </div>
          </section>

          {/* PARTICIPATION DETAILS */}
          <section className={styles.section}>
            <div className={styles.sectionTitle}>
              <span>03</span>

              <div>
                <h2>Participation Details</h2>
                <p>
                  Select your participation and certificate category.
                </p>
              </div>
            </div>

            <div className={styles.grid}>
              <SelectField
                label="Participation Type"
                name="participationType"
                value={form.participationType}
                onChange={handleChange}
                options={["Online", "Offline"]}
              />

              <SelectField
                label="Certificate Type"
                name="certificateType"
                value={form.certificateType}
                onChange={handleChange}
                options={[
                  "Organizer",
                  "Resource Person",
                  "Delegate",
                  "Research Paper",
                  "Poster",
                ]}
              />

              {/* DYNAMIC TITLE FIELD */}
              {showPresentationTitle && (
                <div className={styles.full}>
                  <Field
                    label={presentationLabel}
                    name="presentationTitle"
                    value={form.presentationTitle}
                    onChange={handleChange}
                    placeholder={presentationPlaceholder}
                    required
                    maxLength={MAX_TITLE_LENGTH}
                  />

                  <div
                    className={
                      titleCharacterCount >= MAX_TITLE_LENGTH
                        ? styles.characterCountLimit
                        : styles.characterCount
                    }
                  >
                    {titleCharacterCount}/{MAX_TITLE_LENGTH} characters
                    <span> (including spaces)</span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* EVENT */}
          <section className={styles.event}>
            <small>CONFERENCE</small>

            <h2>1st International Conference</h2>

            <p>
              Innovative Approaches in Nursing Education for Excellence in
              Teaching &amp; Learning
            </p>

            <strong>IANETL 2026</strong>
          </section>

          {/* FOOTER */}
          <div className={styles.footer}>
            <p>
              By submitting this form, you confirm that the information
              provided is correct.
            </p>

            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Registration →"}
            </button>
          </div>
        </form>

        {/* =========================
            LOADING MODAL
        ========================== */}
        {loading && (
          <div className={styles.modalOverlay}>
            <div
              className={`${styles.modal} ${styles.loadingModal}`}
              role="dialog"
              aria-modal="true"
            >
              <div className={styles.spinner}></div>

              <h2>Submitting Registration</h2>

              <p>
                Please wait while we submit your registration.
              </p>

              <span className={styles.modalNote}>
                Please do not close or refresh this page.
              </span>
            </div>
          </div>
        )}

        {/* =========================
            SUCCESS MODAL
        ========================== */}
        {result && !loading && (
          <div className={styles.modalOverlay}>
            <div
              className={`${styles.modal} ${styles.successModal}`}
              role="dialog"
              aria-modal="true"
            >
              <div className={styles.successIcon}>✓</div>

              <span className={styles.modalLabel}>
                REGISTRATION SUCCESSFUL
              </span>

              <h2>Registration Submitted!</h2>

              <p>
                Your registration has been submitted successfully.
              </p>

              <p className={styles.modalSecondaryText}>
                Your registration is now pending admin verification.
                You can check your certificate status later using your
                registered email address.
              </p>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.modalPrimary}
                  onClick={handleGoHome}
                >
                  Home
                </button>

                <button
                  type="button"
                  className={styles.modalSecondary}
                  onClick={handleCheckStatus}
                >
                  Check Status
                </button>
              </div>

              <div className={styles.redirectText}>
                Redirecting to Home in{" "}
                <strong>{countdown}</strong> seconds
              </div>
            </div>
          </div>
        )}

        {/* =========================
            ERROR MODAL
        ========================== */}
        {error && !loading && (
          <div className={styles.modalOverlay}>
            <div
              className={`${styles.modal} ${styles.errorModal}`}
              role="alertdialog"
              aria-modal="true"
            >
              <div className={styles.errorIcon}>!</div>

              <span className={styles.modalLabel}>
                REGISTRATION ERROR
              </span>

              <h2>Registration Failed</h2>

              <p>{error}</p>

              <button
                type="button"
                className={styles.errorButton}
                onClick={handleCloseError}
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}

function Field({ label, full, ...props }) {
  return (
    <label className={full ? styles.full : ""}>
      <span>
        {label} {props.required && <b>*</b>}
      </span>

      <input {...props} />
    </label>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}) {
  return (
    <label>
      <span>
        {label} <b>*</b>
      </span>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export default Register;