import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "../Firebase/firebase";
import useShowToast from "./useShowToast";
import { useAuth } from "../context/AuthStoreContext";

const useLogout = () => {
  const [signOut, loading, error] = useSignOut(auth);
  const { displayToast } = useShowToast();
  const { userLogout } = useAuth();

  const handleLogOut = async () => {
    try {
      await signOut();
      localStorage.removeItem("user-info");
      userLogout();
    } catch (error) {
      displayToast({ text: `${error}`, status: "error" });
    }
  };

  return { handleLogOut, loading, error };
};

export default useLogout;
