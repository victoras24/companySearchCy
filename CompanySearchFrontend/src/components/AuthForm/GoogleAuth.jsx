import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../Firebase/firebase";
import useShowToast from "../../Hooks/useShowToast";
import { useAuth } from "../../context/AuthStoreContext";
import { setDoc, doc, getDoc } from "firebase/firestore";
import Toast from "../Toast";
import { useNavigate } from "react-router-dom";
import { Icon } from "../Icon";

const GoogleAuth = ({ prefix }) => {
	const [signInWithGoogle, error] = useSignInWithGoogle(auth);

	const { userLogin } = useAuth();
	const { displayToast, toastContent, showToast } = useShowToast();
	const navigate = useNavigate();

	const handleGoogleAuth = async () => {
		try {
			const newUser = await signInWithGoogle();
			if (!newUser && error) {
				displayToast({ text: `${error.message}`, status: "error" });
				return;
			}
			const userRef = doc(firestore, "users", newUser.user.uid);
			const userSnap = await getDoc(userRef);

			// signin
			if (userSnap.exists()) {
				const userDoc = userSnap.data();
				localStorage.setItem("user-info", JSON.stringify(userDoc));
				userLogin(userDoc);
				navigate("/");
				displayToast({
					text: `Welcome ${userDoc.username}!`,
					status: "success",
				});
			}
			// register
			else {
				const userDoc = {
					uid: newUser.user.uid,
					email: newUser.user.email,
					username: newUser.user.email.split("@")[0],
					fullName: newUser.user.displayName,
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
			displayToast({ text: `${error.message}`, status: "error" });
		}
	};

	return (
		<div className="account-page-google-register" onClick={handleGoogleAuth}>
			<Icon symbol={faGoogle} style="d-block align-middle w-75 h-75" />
			<span className="account-page-google-text">{prefix} with Google</span>
			{showToast && <Toast {...toastContent} />}
		</div>
	);
};

export default GoogleAuth;
