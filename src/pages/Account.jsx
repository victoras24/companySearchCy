import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons"; // Correct import

export default function Account() {
  return (
    <div className="account-page-container">
      <div className="account-page-intro">
        <h1>Log in</h1>
        <p>
          Login to save and organize the companies you search for, making it
          easier to track, manage, and revisit important information.
        </p>
      </div>
      <div className="account-page-google-login">
        <FontAwesomeIcon
          icon={faGoogle}
          style={{
            display: "inlineBlock",
            verticalAlign: "middle",
            width: "2rem",
            height: "2rem",
          }}
        />
        <span className="account-page-google-text">Login with Google</span>
      </div>
      <div className="account-page-divider">OR</div>
      <div className="account-page-information">
        <p>Email</p>
        <input type="text" />
        <p>Password</p>
        <input type="password" />
        <button>Sign in</button>
        <p className="account-page-register">Register</p>
      </div>
    </div>
  );
}
