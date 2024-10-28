import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import useShowToast from "../../Hooks/useShowToast";
import Toast from "../Toast";
import useLogin from "../../Hooks/useLogin";
import { useState } from "react";

export default function Login(props) {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const { showToast, toastContent, displayToast } = useShowToast();
  const { loading, error, login } = useLogin();
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
        <input
          type="text"
          value={inputs.email}
          onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
        />
        <span>Password</span>
        <input
          type="password"
          value={inputs.password}
          onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
        />
        <button onClick={() => login(inputs, displayToast)}>Sign in</button>
        <span
          onClick={() => props.isRegister(true)}
          style={{ cursor: "pointer", textAlign: "center" }}
        >
          Create an account now!
        </span>
      </div>
      {showToast && <Toast {...toastContent} />}
    </div>
  );
}
