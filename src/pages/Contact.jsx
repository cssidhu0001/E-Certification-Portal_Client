import PageNavigation from "../components/PageNavigation";
import PageShell from "../components/PageShell";
import styles from "./Contact.module.css";

function Contact() {
  return (
    <PageShell>
      <main className={styles.page}>
        {/* HERO */}
        <section className={styles.hero}>
          <span className={styles.eyebrow}>IANETL 2026</span>

          <h1>Contact Us</h1>

          <p>
            Have a question regarding your registration, certificate,
            conference participation, or technical support? Our team is
            here to help.
          </p>
        </section>

        {/* CONTACT CARDS */}
        <section className={styles.contactGrid}>
          {/* CONFERENCE */}
          <div className={styles.card}>
            <div className={styles.icon}>✦</div>

            <span className={styles.cardLabel}>
              CONFERENCE INFORMATION
            </span>

            <h2>Conference Queries</h2>

            <p>
              For more information related to the conference,
              please contact:
            </p>

            <a
              href="tel:+917534646486"
              className={styles.contactPerson}
            >
              Ms. Neha Rautela
              <span>+91 75346 46486</span>
            </a>
          </div>

          {/* ABSTRACT */}
          <div className={styles.card}>
            <div className={styles.icon}>✦</div>

            <span className={styles.cardLabel}>
              ABSTRACTS & PRESENTATION
            </span>

            <h2>Research Queries</h2>

            <p>
              For more information related to abstracts and
              presentation:
            </p>

            <a
              href="tel:+918449926243"
              className={styles.contactPerson}
            >
              Ms. Akansha
              <span>+91 84499 26243</span>
            </a>
          </div>

          {/* SPONSORSHIP */}
          <div className={styles.card}>
            <div className={styles.icon}>✦</div>

            <span className={styles.cardLabel}>
              SPONSORSHIP
            </span>

            <h2>Sponsorship Queries</h2>

            <p>
              For more information related to sponsorship:
            </p>

            <a
              href="tel:+91914029443"
              className={styles.contactPerson}
            >
              Mr. Gourav
              <span>+91 91402 94443</span>
            </a>
          </div>

          {/* ACCOMMODATION */}
          <div className={styles.card}>
            <div className={styles.icon}>✦</div>

            <span className={styles.cardLabel}>
              ACCOMMODATION & TRANSPORT
            </span>

            <h2>Travel Assistance</h2>

            <p>
              For more information related to accommodation and
              transport:
            </p>

            <a
              href="tel:+918958804327"
              className={styles.contactPerson}
            >
              Ms. Ankita
              <span>+91 89588 04327</span>
            </a>
          </div>
        </section>

        {/* TECHNICAL SUPPORT */}
        <section className={styles.supportSection}>
          <div className={styles.supportContent}>
            <span className={styles.eyebrow}>
              PORTAL SUPPORT
            </span>

            <h2>Technical Support</h2>

            <p>
              Facing an issue with registration, certificate
              status, certificate download, or verification?
              Contact our technical support team.
            </p>

            <div className={styles.supportPerson}>
              <div>
                <span>Technical Support</span>
                <strong>Mr. Charanjeet Singh Sidhu</strong>
              </div>

              <div className={styles.supportActions}>
                <a href="tel:+918433024414">
                  📞 +91 84330 24414
                </a>

                <a href="mailto:nursingconference@gmail.com">
                  ✉ nursingconference@gmail.com
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* EMAIL */}
        <section className={styles.emailSection}>
          <span className={styles.eyebrow}>EMAIL US</span>

          <h2>Need further assistance?</h2>

          <p>
            For general conference or registration related
            queries, you can also reach us by email.
          </p>

          <a
            href="mailto:nursingconference@gmail.com"
            className={styles.emailButton}
          >
            nursingconference@gmail.com
          </a>
        </section>

        {/* ABOUT MIET */}
        <section className={styles.about}>
          <div className={styles.aboutHeader}>
            <span className={styles.eyebrow}>ABOUT THE INSTITUTE</span>

            <h2>About MIET Kumaon</h2>
          </div>

          <div className={styles.aboutText}>
            <p>
              MIET Kumaon is a premier group of institutions
              committed to excellence in education and professional
              training in the Kumaon region. The MIET Group of
              Institutions offers a wide range of career-focused
              programs designed to combine academic rigor with
              practical, clinical, and industry-oriented learning,
              preparing students for successful professional
              careers.
            </p>

            <p>
              The institute offers Nursing and paramedical programs
              B.Sc. Nursing, GNM, BPT (Bachelor of Physiotherapy),
              BMLT (Bachelor of Medical Laboratory Technology), and
              BMRIT (Bachelor of Medical Radiology and Imaging
              Technology), which is affiliated with Hemwati Nandan
              Bahuguna Uttarakhand Medical Education University
              (HNBUMEU). In other sectors, BBA (Bachelor of Business
              Administration) and BCA (Bachelor of Computer
              Applications) affiliated with Kumaon University,
              Nainital.
            </p>

            <p>
              MIET Kumaon is supported by a team of experienced and
              qualified faculty members, including academicians and
              industry professionals who integrate real-world
              perspectives into teaching. Through interactive
              learning methodologies, hands-on laboratory work,
              clinical internships, workshops, and seminars the
              institute focuses on developing critical thinking,
              leadership skills, and professional competence.
            </p>

            <p>
              The campus is equipped with modern infrastructure,
              including advanced laboratories, computer centers,
              nursing and simulation labs, a well-stocked library,
              and comfortable residential facilities, creating a
              supportive environment for academic and personal
              growth.
            </p>

            <p>
              With a strong emphasis on personality development,
              communication skills, and career readiness, and
              supported by an active training and placement cell,
              MIET Kumaon continues to uphold high standards in
              higher and professional education.
            </p>
          </div>
        </section>

        {/* SOCIAL */}
        <section className={styles.socialSection}>
          <span className={styles.eyebrow}>STAY CONNECTED</span>

          <h2>Follow MIET Kumaon</h2>

          <div className={styles.socialGrid}>
            <div>
              <strong>Instagram</strong>
              <span>@miet_kumaon</span>
            </div>

            <div>
              <strong>Facebook</strong>
              <span>facebook.com/miet098/</span>
            </div>

            <div>
              <strong>YouTube</strong>
              <span>@mietkumaon</span>
            </div>

            <div>
              <strong>LinkedIn</strong>
              <span>MIETKumaon</span>
            </div>
          </div>
        </section>
        <PageNavigation/>
      </main>
    </PageShell>
  );
}

export default Contact;