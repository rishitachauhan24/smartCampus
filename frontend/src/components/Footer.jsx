import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">

          {/* Brand */}
          <div className="footer-col">
            <div className="footer-brand">
              <span className="footer-brand-mark">S</span>
              <span className="footer-brand-name">SmartCampus</span>
            </div>
            <p>
              AI-powered campus management platform connecting students,
              staff, and administrators to make campus life better.
            </p>
          </div>

          {/* Platform links */}
          <div className="footer-col">
            <h4>Platform</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/campus-status">Campus Status</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div className="footer-col">
            <h4>Features</h4>
            <ul className="footer-links">
              <li><a href="#">Issue Reporting</a></li>
              <li><a href="#">AI Analysis</a></li>
              <li><a href="#">Staff Management</a></li>
              <li><a href="#">Analytics</a></li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} SmartCampus. All rights reserved.</p>
          <div className="footer-badges">
            <span className="footer-badge">React</span>
            <span className="footer-badge">Node.js</span>
            <span className="footer-badge">AI Powered</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
