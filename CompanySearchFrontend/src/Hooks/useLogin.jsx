import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { firestore, auth } from "../Firebase/firebase";
import { getDoc, doc } from "firebase/firestore";
import { useAuth } from "../context/AuthStoreContext";

const useLogin = () => {
  const [signInWithEmailAndPassword, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const { userLogin } = useAuth();

  const login = async (inputs, displayToast) => {
    if (!inputs.email || !inputs.password) {
      return displayToast({
        text: "Please fill all the fields",
        status: "error",
      });
    }
    try {
      const userCred = await signInWithEmailAndPassword(
        inputs.email,
        inputs.password
      );
      if (userCred) {
        const docRef = doc(firestore, "users", userCred.user.uid);
        const docSnap = await getDoc(docRef);

        localStorage.setItem("user-info", JSON.stringify(docSnap.data()));
        userLogin(docSnap.data());
      }
    } catch (error) {
      displayToast({ text: `${error.message}`, status: "error" });
    }
  };
  return { loading, error, login };
};

export default useLogin;
