import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faDatabase,
  faBolt,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">
        Save time <span className="home-title-highlight">searching</span> for
        Cyprus companies
      </h1>
      <p className="home-paragraph">
        Save hours of time for you and your team when searching for Cyprus
        company information so you can focus on what matters most.
      </p>
      <NavLink to="search">
        <button className="home-search-button">
          <FontAwesomeIcon
            icon={faSearch}
            className="home-search-button-icon"
          />
          Begin Search
        </button>
      </NavLink>
      <div className="key-features">
        <div className="feature">
          <FontAwesomeIcon icon={faDatabase} />
          <h3>Comprehensive Database</h3>
          <p>Access detailed information on all registered Cyprus companies</p>
        </div>
        <div className="feature">
          <FontAwesomeIcon icon={faBolt} />
          <h3>Real-time Updates</h3>
          <p>Stay informed with the latest company data and changes</p>
        </div>
        <div className="feature">
          <FontAwesomeIcon icon={faShieldAlt} />
          <h3>Verified Information</h3>
          <p>Trust in our accurate and officially sourced data</p>
        </div>
      </div>
      <div className="testimonial">
        <blockquote>
          "This tool has revolutionized our due diligence process. It's
          indispensable for our business operations in Cyprus."
        </blockquote>
      </div>
      <div className="cta-advanced">
        <h2>Need More Comprehensive Tools?</h2>
        <p>
          Discover our advanced features for in-depth analysis and reporting.
        </p>
        <button className="cta-button">Explore Premium Features</button>
      </div>
      <div className="recent-updates">
        <h2>Latest Updates</h2>
        <ul>
          <li>New feature: Export search results to CSV</li>
          <li>Database updated with Q2 2024 company registrations</li>
          <li>Improved search algorithm for faster results</li>
        </ul>
      </div>
      <div className="faq-preview">
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>How often is the database updated?</summary>
          <p>
            Our database is updated daily with the latest information from
            official sources.
          </p>
        </details>
        <details>
          <summary>Can I integrate this data into my own systems?</summary>
          <p>
            Yes, we offer API access for seamless integration. Contact our
            support team for details.
          </p>
        </details>
        <a>View all FAQs</a>
      </div>
    </div>
  );
}
