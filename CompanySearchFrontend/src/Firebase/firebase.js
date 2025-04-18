import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyDSTol_xVo-KknOgLFAUFbBIiqpuAbrlFE",
	authDomain: "company-search-39b6f.firebaseapp.com",
	databaseURL:
		"https://company-search-39b6f-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "company-search-39b6f",
	storageBucket: "company-search-39b6f.firebasestorage.app",
	messagingSenderId: "1072114431278",
	appId: "1:1072114431278:web:347a85ce542294c89b36bf",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };
