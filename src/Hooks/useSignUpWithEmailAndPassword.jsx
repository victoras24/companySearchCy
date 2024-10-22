import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "../Firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

export default function useSignUpWithEmailAndPassword() {
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const signup = async (inputs) => {
    if (
      !inputs.email ||
      !inputs.password ||
      !inputs.username ||
      !inputs.fullName
    )
      console.log("please fill all the fields");
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { loading, error, signup };
}
