import {
  useAuthState,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { auth, firestore } from "../Firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useAuth } from "../context/AuthStoreContext";

export default function useSignUpWithEmailAndPassword() {
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const [currentUser] = useAuthState(auth);
  const { userLogin, userLogout } = useAuth();

  const signup = async (inputs, displayToast) => {
    if (
      !inputs.email ||
      !inputs.password ||
      !inputs.username ||
      !inputs.fullName
    )
      displayToast({ text: "Please fill all the fields", status: "info" });
    try {
      const newUser = await createUserWithEmailAndPassword(
        auth,
        inputs.email,
        inputs.password
      );
      if (!newUser && error) {
        console.log(error);
        return;
      }
      if (newUser) {
        const userDoc = {
          uid: newUser.user.uid,
          email: inputs.email,
          username: inputs.username,
          fullName: inputs.fullName,
          savedCompanies: [],
          groups: [],
        };
        await setDoc(doc(firestore, "users", newUser.user.uid), userDoc);
        localStorage.setItem("user-info", JSON.stringify(userDoc));
        userLogin(userDoc);
        displayToast({
          text: `User ${userDoc.username} is created`,
          status: "success",
        });
      }
    } catch (error) {
      console.log(error);
      displayToast({ text: `${error}`, status: "error" });
    }
  };

  return { loading, error, signup, user, currentUser };
}
