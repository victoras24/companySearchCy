import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

export default function Login(props) {
  return (
    <div className="account-page-container">
      <h1>Log in</h1>
      <p>
        Login to save and organize the companies you search for, making it
        easier to track, manage, and revisit important information.
      </p>
      <div className="account-page-google-login">
        <FontAwesomeIcon
          icon={faGoogle}
          style={{
            display: "inline-block",
            verticalAlign: "middle",
            width: "2rem",
            height: "2rem",
          }}
        />
        <span className="account-page-google-text">Login with Google</span>
      </div>
      <div className="account-page-divider">OR</div>
      <div className="account-page-information">
        <span>Email</span>
        <input type="text" />
        <span>Password</span>
        <input type="password" />
        <button>Sign in</button>
        <span
          onClick={() => props.isRegister(true)}
          style={{ cursor: "pointer", textAlign: "center" }}
        >
          Create an account now!
        </span>
      </div>
    </div>
  );
}
