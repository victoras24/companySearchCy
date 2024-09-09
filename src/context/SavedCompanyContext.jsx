import { createContext, useState, useContext } from "react";
import { v4 as uuidv4 } from "uuid";

const SavedCompanyContext = createContext();

export function SavedCompanyProvider({ children }) {
  const [groups, setGroups] = useState([]);
  const [savedCompanies, setSavedCompanies] = useState([]);

  const createGroup = (groupName) => {
    setGroups((prevState) => [
      ...prevState,
      { id: uuidv4(), name: groupName, companies: [] },
    ]);
  };

  const saveCompany = (company) => {
    setSavedCompanies((prevState) => {
      const index = prevState.findIndex(
        (c) => c.registration_no === company.registration_no
      );
      if (index >= 0) {
        return prevState.filter(
          (c) => c.registration_no !== company.registration_no
        );
      } else {
        return [...prevState, { ...company, isSaved: true }];
      }
    });
  };

  return (
    <SavedCompanyContext.Provider
      value={{
        groups,
        setGroups,
        savedCompanies,
        setSavedCompanies,
        createGroup,
        saveCompany,
      }}
    >
      {children}
    </SavedCompanyContext.Provider>
  );
}

export function useCompanyContext() {
  return useContext(SavedCompanyContext);
}
