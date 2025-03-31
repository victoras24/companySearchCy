import useShowToast from "../../Hooks/useShowToast";
import Toast from "../Toast";
import useLogin from "../../Hooks/useLogin";
import { useState } from "react";
import GoogleAuth from "./GoogleAuth";
import { Button } from "../Button";

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
      <GoogleAuth prefix={login ? "Login" : "Register"} />
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
        <Button onClick={() => login(inputs, displayToast)} content="Sign in" />
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
