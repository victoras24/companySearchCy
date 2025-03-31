import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthStoreContext";
import { firestore } from "../Firebase/firebase";
import { doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";

const useSaveCompany = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user, updateUser } = useAuth();

  const handleSaveCompany = async (company, displayToast) => {
    try {
      const currentUserRef = doc(firestore, "users", user.uid);

      await updateDoc(currentUserRef, {
        savedCompanies: isFavorite ? arrayRemove(company) : arrayUnion(company),
      });

      if (isFavorite) {
        updateUser({
          ...user,
          savedCompanies: user.savedCompanies.filter(
            (clickedCompanyId) => clickedCompanyId !== company
          ),
        });

        localStorage.setItem(
          "user-info",
          JSON.stringify({
            ...user,
            savedCompanies: user.savedCompanies.filter(
              (clickedCompanyId) => clickedCompanyId !== company
            ),
          })
        );

        setIsFavorite(false);
      } else {
        updateUser({
          ...user,
          savedCompanies: [...user.savedCompanies, company],
        });

        localStorage.setItem(
          "user-info",
          JSON.stringify({
            ...user,
            savedCompanies: [...user.savedCompanies, company],
          })
        );

        setIsFavorite(true);
      }
    } catch (error) {
      displayToast({ text: error.message, status: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  //   useEffect(() => {
  //     if (user) {
  //       const isFavorite = user.savedCompanies.includes(company);
  //       setIsFavorite(isFavorite);
  //     }
  //   }, [user, user.savedCompanies]);

  return { isUpdating, isFavorite, handleSaveCompany };
};

export default useSaveCompany;
