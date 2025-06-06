import { Icon } from "../components/Icon";
import {
  faSearch,
  faDatabase,
  faBolt,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import React from "react";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <h1 className="home-title">
        Save time <span className="home-title-highlight">searching</span> for
        Cyprus companies
      </h1>
      <p className="home-paragraph p-3">
        Save hours of time for you and your team when searching for Cyprus
        company information so you can focus on what matters most.
      </p>
      <Button
        content="Begin Search"
        icon={faSearch}
        onClick={() => navigate("/search")}
        variant={"primary"}
        size={"sm"}
      />
      <div className="key-features">
        <div className="feature">
          <Icon symbol={faDatabase} />
          <h3>Comprehensive Database</h3>
          <p>Access detailed information on all registered Cyprus companies</p>
        </div>
        <div className="feature">
          <Icon symbol={faBolt} />
          <h3>Real-time Updates</h3>
          <p>Stay informed with the latest company data and changes</p>
        </div>
        <div className="feature">
          <Icon symbol={faShieldAlt} />
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
        <Button
          content="Explore Premium Features"
          variant={"primary"}
          size={"sm"}
        />
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
};
