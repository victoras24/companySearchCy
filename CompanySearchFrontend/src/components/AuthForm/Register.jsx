import { useState } from "react";
import useSignUpWithEmailAndPassword from "../../Hooks/useSignUpWithEmailAndPassword";
import useShowToast from "../../Hooks/useShowToast";
import Toast from "../Toast";
import GoogleAuth from "./GoogleAuth";
import { Button } from "../Button";

export default function Register(props) {
  const [inputs, setInputs] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const { loading, error, signup } = useSignUpWithEmailAndPassword();
  const { showToast, toastContent, displayToast } = useShowToast();

  return (
    <div className="account-page-container">
      <h1>Register</h1>
      <p>
        Create an account to unlock personalized features that help you stay
        organized and streamline your search experience.
      </p>
      <GoogleAuth prefix={signup ? "Register" : "Login"} />
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
        <Button
          onClick={() => signup(inputs, displayToast)}
          content="Register"
        />
      </div>
      <span
        onClick={() => props.isRegister(false)}
        style={{ cursor: "pointer", marginTop: "1rem" }}
      >
        Already have an account? Login
      </span>
      {showToast && <Toast {...toastContent} />}
    </div>
  );
}
