import { useState } from "react";
import PageShell from "../components/PageShell";
import { registerCandidate } from "../services/api";
import styles from "./Register.module.css";

const initialForm = {
  name: "",
  email: "",
  mobile: "",
  institution: "",
  designation: "",
  participationType: "Online",
  certificateType: "Participation",
  eventName: "1st International Conference - IANETL 2026",
};

function Register() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await registerCandidate(form);
      setResult(data);
      setForm(initialForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

        {result && (
          <div className={styles.success}>
            <div className={styles.icon}>✓</div>
            <div>
              <h3>Registration submitted successfully</h3>
              <p>Your registration is now pending admin verification.</p>
              <p>
                Check your certificate status later using your registered
                email address.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <strong>Registration failed</strong>
            <p>{error}</p>
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
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

          <section className={styles.section}>
            <div className={styles.sectionTitle}>
              <span>03</span>
              <div>
                <h2>Participation Details</h2>
                <p>Select your participation and certificate category.</p>
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
                  "Participation",
                  "Presenter",
                  "Speaker",
                  "Delegate",
                  "Volunteer",
                  "Organizer",
                  "Winner",
                ]}
              />
            </div>
          </section>

          <section className={styles.event}>
            <small>CONFERENCE</small>
            <h2>1st International Conference</h2>
            <p>
              Innovative Approaches in Nursing Education for Excellence in
              Teaching &amp; Learning
            </p>
            <strong>IANETL 2026</strong>
          </section>

          <div className={styles.footer}>
            <p>
              By submitting this form, you confirm that the information
              provided is correct.
            </p>
            <button disabled={loading}>
              {loading ? "Submitting..." : "Submit Registration →"}
            </button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}

function Field({ label, full, ...props }) {
  return (
    <label className={full ? styles.full : ""}>
      <span>{label} {props.required && <b>*</b>}</span>
      <input {...props} />
    </label>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <label>
      <span>{label} <b>*</b></span>
      <select name={name} value={value} onChange={onChange} required>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

export default Register;
