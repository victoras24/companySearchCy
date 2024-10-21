// import { initializeApp } from "firebase/app";
// import { getFirestore, getDocs, collection } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_API_KEY,
//   authDomain: import.meta.env.VITE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_APP_ID,
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// const companyCollectionRef = collection(db, "companies");

// export const fetchCompanyData = async (input, corsUrl, companyApiUrl) => {
//   const snapshot = await getDocs(companyCollectionRef);
//   const companies = snapshot.docs.map((doc) => ({
//     ...doc.data(),
//     id: doc.id,
//   }));
//   console.log(companies);
// };

export const fetchCompanyData = async (input, corsUrl, companyApiUrl) => {
  try {
    console.log("Fetching company data for:", input);
    const res = await fetch(`${corsUrl}${companyApiUrl}`);
    const data = await res.json();
    console.log("Company API response:", data);

    if (!data || typeof data !== "object") {
      console.error("Unexpected response format from company API:", data);
      return [];
    }

    // Check for different possible structures
    const records = data.result?.records || data.records || [];

    return Array.isArray(records) ? records : [];
  } catch (err) {
    console.error("Error fetching company data:", err);
    return [];
  }
};
