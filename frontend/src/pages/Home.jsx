import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">

      {/* ===== HERO ===== */}
      <section className="hero">

        <div className="hero-content">

          <span className="eyebrow">
            AI-POWERED CAMPUS PLATFORM
          </span>

          <h1>
            Make campus problems easier to report, manage and solve.
          </h1>

          <p>
            SmartCampus connects students, staff and administrators in one
            unified platform — and uses AI to analyze, prioritize and
            suggest solutions for campus issues.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary">
              Get Started Free
            </Link>
            <Link to="/campus-status" className="btn btn-secondary">
              View Campus Status
            </Link>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <strong>AI</strong>
              <span>Powered Analysis</span>
            </div>
            <div className="hero-stat">
              <strong>3</strong>
              <span>User Roles</span>
            </div>
            <div className="hero-stat">
              <strong>Real‑time</strong>
              <span>Issue Tracking</span>
            </div>
          </div>

        </div>

        <div className="hero-card">
          <div className="hero-card-icon">🤖</div>
          <h3>Smart Issue Assistant</h3>
          <p>
            AI-assisted classification, priority scoring, summary generation
            and action suggestions — all in seconds.
          </p>
        </div>

      </section>

      {/* ===== FEATURES ===== */}
      <section className="section">

        <div className="section-heading">
          <span className="eyebrow">CORE FEATURES</span>
          <h2>One platform for the whole campus</h2>
        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <span>📝</span>
            <h3>Easy Reporting</h3>
            <p>
              Students can report campus problems in seconds with photos,
              location, and priority — even anonymously.
            </p>
          </div>

          <div className="feature-card">
            <span>📊</span>
            <h3>Issue Tracking</h3>
            <p>
              Track every issue from Pending → Assigned → In Progress → Resolved
              with full status history.
            </p>
          </div>

          <div className="feature-card">
            <span>🧠</span>
            <h3>AI Assistance</h3>
            <p>
              AI analyzes reported issues, classifies them, and suggests
              the best action for staff to take.
            </p>
          </div>

          <div className="feature-card">
            <span>📈</span>
            <h3>Analytics</h3>
            <p>
              Understand campus problem trends by category, location,
              and priority with rich analytics.
            </p>
          </div>

        </div>

      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="how-section">

        <div className="section-heading">
          <span className="eyebrow">HOW IT WORKS</span>
          <h2>From report to resolution in 3 steps</h2>
        </div>

        <div className="steps-grid">

          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Student Reports</h3>
            <p>
              A student spots a problem — broken light, Wi-Fi issue, dirty
              hostel — and reports it via SmartCampus in seconds.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Admin Assigns</h3>
            <p>
              Admin reviews the AI-analyzed issue and assigns it to the most
              suitable staff member with one click.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Staff Resolves</h3>
            <p>
              Staff sees their assigned issues, uses AI suggestions, updates
              progress, and marks it resolved.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;