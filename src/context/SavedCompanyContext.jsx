import React, { createContext, useState, useContext } from "react";
import { v4 as uuidv4 } from "uuid";

const SavedCompanyContext = createContext();

export function SavedCompanyProvider({ children }) {
  const [groups, setGroups] = useState([]);
  const [savedCompanies, setSavedCompanies] = useState([]);

  const addCompanyToGroup = (company, groupId) =>
    setGroups((prevState) =>
      prevState.map((previousGroup) => {
        return previousGroup.id === groupId
          ? {
              ...previousGroup,
              isExtended: true,
              companies: [
                ...previousGroup.companies.filter(
                  (prevCompany) => prevCompany.entry_id !== company.entry_id
                ),
                company,
              ],
            }
          : previousGroup;
      })
    );

  const createGroup = (groupName) =>
    setGroups((prevState) => [
      ...prevState,
      {
        id: `group-${uuidv4()}`,
        name: groupName,
        isExtended: false,
        companies: [],
      },
    ]);

  return (
    <SavedCompanyContext.Provider
      value={{
        groups,
        setGroups,
        savedCompanies,
        setSavedCompanies,
        createGroup,
        addCompanyToGroup,
      }}
    >
      {children}
    </SavedCompanyContext.Provider>
  );
}

export function useCompanyContext() {
  return useContext(SavedCompanyContext);
}
