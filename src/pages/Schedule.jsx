import PageNavigation from "../components/PageNavigation";
import PageShell from "../components/PageShell";
import styles from "./Schedule.module.css";

const day1 = [
  {
    time: "8:30 AM – 9:00 AM",
    title: "Breakfast and On the Spot Registration",
    type: "break",
  },
  {
    time: "9:00 AM – 10:00 AM",
    title: "Innovative Techniques in Case Study Teaching",
    speaker: "Mr. Albin Joseph Y",
    designation:
      "Nursing Supervisor, CCN Health Assurance Hospital, Kuwait",
  },
  {
    time: "10:00 AM – 10:55 AM",
    title: "Advancing Nursing Education Through Competency-Based Education",
    speaker: "Dr. Lekha Viswanath",
    designation:
      "Principal, Amrita College of Nursing, Faridabad Campus",
  },
  {
    time: "10:55 AM – 11:05 AM",
    title: "High Tea",
    type: "break",
  },
  {
    time: "11:05 AM – 1:00 PM",
    title:
      "Student-Centered Learning: Helping Future Nurses Grow Through Problem-Based, Case-Based, and Team Learning",
    speaker: "Mr. Himanshu Joshi",
    designation:
      "ANS Head Training and Training & Development, Medanta",
  },
  {
    time: "1:00 PM – 2:00 PM",
    title: "Lunch",
    type: "break",
  },
  {
    time: "2:00 PM – 3:00 PM",
    title:
      "Bridging the Gap Between Theory and Clinical Practice Future of Nursing Education in the Digital Era",
    speaker: "Mr. Earnest Samuel",
    designation:
      "Registered Mental Health Nurse, NHS Wales, United Kingdom",
    note: "ONLINE MODE",
  },
  {
    time: "4:00 PM – 5:00 PM",
    title: "High Tea",
    type: "break",
  },
  {
    time: "6:00 PM – 8:00 PM",
    title: "Cultural Evening",
    type: "event",
  },
  {
    time: "8:00 PM – 9:00 PM",
    title: "Dinner",
    type: "break",
  },
];

const day2 = [
  {
    time: "8:30 AM – 9:00 AM",
    title: "Breakfast and On the Spot Registration",
    type: "break",
  },
  {
    time: "9:00 AM – 10:30 AM",
    title: "Inaugural Ceremony",
    type: "event",
  },
  {
    time: "",
    title:
      "Plenary Session I – Modern Learning Ecosystems: Integrating Technology for Nursing Education Excellence",
    type: "section",
  },
  {
    time: "11:30 AM – 12:25 PM",
    title: "Ethical and Responsible Use of Artificial Intelligence in Nursing Education",
    speaker: "Dr. Rajesh Kumar Sharma",
    designation:
      "Professor & Head of Critical Care Nursing, SRHU, Jollygrant, Dehradun",
  },
  {
    time: "12:25 PM – 12:35 PM",
    title: "High Tea",
    type: "break",
  },
  {
    time: "12:35 PM – 1:30 PM",
    title:
      "Integrating Artificial Intelligence and Informatics to Transform Nursing Education",
    speaker: "Dr. Priyanka A. Masih",
    designation:
      "Professor Cum Principal, Rohilkhand College of Nursing, Bareilly",
  },
  {
    time: "1:30 PM – 2:00 PM",
    title: "Lunch",
    type: "break",
  },
  {
    time: "2:00 PM – 3:00 PM",
    title: "Human Intelligence meets AI: Redefining Nursing Education",
    speaker: "Mrs. Chetna",
    designation: "Professor Cum Principal, CIMS&R, Dehradun",
  },
  {
    time: "3:00 PM – 4:30 PM",
    title: "Gamification in Nursing Education",
    speaker: "Dr. Prathiba Manoharam. B",
    designation:
      "Professor Cum Principal, Keshartha College of Nursing, Bareilly",
  },
  {
    time: "4:30 PM – 5:00 PM",
    title: "High Tea",
    type: "break",
  },
];

const day3 = [
  {
    time: "8:00 AM – 8:30 AM",
    title: "Breakfast",
    type: "break",
  },
  {
    time: "8:35 AM – 9:30 AM",
    title: "“Integrating Nursing Modules Through Innovative Approaches”",
    speaker: "Mr. Subjot Balan Namath",
    designation: "Assistant Professor, SGT University, Gurugram",
  },
  {
    time: "9:30 AM – 10:15 AM",
    title:
      "The Golden Minutes: Understanding Adult Basic Life Support & the Chain of Survival",
    speaker: "Dr. Swapnil Vithal Rahane",
    designation:
      "(AHA Instructor), Associate Professor, Parul Institute of Nursing, Parul University, Vadodara",
  },
  {
    time: "",
    title: "Hands-on Training",
    type: "section",
  },
  {
    time: "10:30 AM – 1:30 PM",
    title:
      "Hands-on Session – Hands That Save Lives – Adult CPR & Airway Management",
    speaker: "Dr. Swapnil Vithal Rahane",
    designation:
      "(AHA Instructor), Associate Professor, Parul Institute of Nursing, Vadodara",
  },
  {
    time: "1:30 PM – 2:00 PM",
    title: "Lunch",
    type: "break",
  },
  {
    time: "2:00 PM – 4:00 PM",
    title:
      "Hands-on Session – BLS in Action – AED, Choking & Integrated Resuscitation",
    speaker: "Mr. Prashant Sharma",
    designation:
      "(AHA Instructor, SR Healthcare & Academic Foundation)",
  },
  {
    time: "4:00 PM – 4:15 PM",
    title:
      "Post-test, feedback, key take-home messages & certificate distribution",
    type: "event",
  },
  {
    time: "4:15 PM – 4:30 PM",
    title: "High Tea",
    type: "break",
  },
  {
    time: "4:30 PM – 5:00 PM",
    title: "Valedictory Session",
    type: "event",
  },
];

function ScheduleTable({ day, items }) {
  return (
    <section className={styles.daySection}>
      <div className={styles.dayHeader}>
        <div>
          <span>PROGRAMME</span>
          <h2>{day}</h2>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <div className={`${styles.row} ${styles.tableHead}`}>
          <div>Time</div>
          <div>Session / Programme</div>
          <div>Resource Person</div>
        </div>

        {items.map((item, index) => {
          if (item.type === "section") {
            return (
              <div key={index} className={styles.sectionRow}>
                {item.title}
              </div>
            );
          }

          return (
            <div
              key={index}
              className={`${styles.row} ${
                item.type === "break" ? styles.breakRow : ""
              }`}
            >
              <div className={styles.time}>{item.time}</div>

              <div className={styles.session}>
                <strong>{item.title}</strong>

                {item.note && (
                  <span className={styles.note}>{item.note}</span>
                )}
              </div>

              <div className={styles.resource}>
                {item.speaker ? (
                  <>
                    <strong>{item.speaker}</strong>
                    <span>{item.designation}</span>
                  </>
                ) : (
                  <span>—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Schedule() {
  return (
    <PageShell>
      <main className={styles.page}>
        <header className={styles.hero}>
          <span className={styles.eyebrow}>IANETL 2026</span>

          <h1>Conference Programme Schedule</h1>

          <p>
            1st International Conference • Innovative Approaches in Nursing
            Education for Excellence in Teaching &amp; Learning
          </p>

          <div className={styles.meta}>
            <span>09th – 11th October 2026</span>
            <span>MIET Kumaon, Haldwani</span>
          </div>
        </header>

        <div className={styles.schedule}>
          <ScheduleTable day="Day 01" items={day1} />
          <ScheduleTable day="Day 02" items={day2} />
          <ScheduleTable day="Day 03" items={day3} />
        </div>
      </main>
      <PageNavigation/>
    </PageShell>
  );
}

export default Schedule;