import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import useSignUpWithEmailAndPassword from "../../Hooks/useSignUpWithEmailAndPassword";

export default function Register(props) {
  const [inputs, setInputs] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const { loading, error, signup } = useSignUpWithEmailAndPassword();

  return (
    <div className="account-page-container">
      <h1>Register</h1>
      <p>
        Create an account to unlock personalized features that help you stay
        organized and streamline your search experience.
      </p>
      <div className="account-page-google-register">
        <FontAwesomeIcon
          icon={faGoogle}
          style={{
            display: "inline-block",
            verticalAlign: "middle",
            width: "2rem",
            height: "2rem",
          }}
        />
        <span className="account-page-google-text">Register with Google</span>
      </div>
      <div className="account-page-divider">OR</div>
      <div className="account-page-information">
        <span>Full Name</span>
        <input
          type="text"
          placeholder="Full Name"
          value={inputs.fullName}
          onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
        />
        <span>Username</span>
        <input
          type="text"
          placeholder="Username"
          value={inputs.username}
          onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
        />
        <span>Email</span>
        <input
          type="text"
          placeholder="Email"
          value={inputs.email}
          onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
        />
        <span>Password</span>
        <input
          type="password"
          placeholder="Password"
          value={inputs.password}
          onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
        />
        <button onClick={() => signup(inputs)}>Register</button>
      </div>
      <span
        onClick={() => props.isRegister(false)}
        style={{ cursor: "pointer", marginTop: "1rem" }}
      >
        Already have an account? Login
      </span>
    </div>
  );
}
