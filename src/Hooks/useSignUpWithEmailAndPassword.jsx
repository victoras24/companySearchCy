import {
  useAuthState,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { auth, firestore } from "../Firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  setDoc,
  doc,
  where,
  query,
  getDocs,
  collection,
} from "firebase/firestore";
import { useAuth } from "../context/AuthStoreContext";

export default function useSignUpWithEmailAndPassword() {
  const [user, loading, error] = useSignInWithEmailAndPassword(auth);
  const [currentUser] = useAuthState(auth);
  const { userLogin } = useAuth();

  const usersRef = collection(firestore, "users");

  const signup = async (inputs, displayToast) => {
    if (
      !inputs.email ||
      !inputs.password ||
      !inputs.username ||
      !inputs.fullName
    ) {
      displayToast({ text: "Please fill all the fields", status: "error" });
      return;
    }
    const q = query(usersRef, where("username", "==", inputs.username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      displayToast({ text: "Username already exists", status: "error" });
      return;
    }
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
          favorites: [],
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
