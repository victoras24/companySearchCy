import React, { createContext, useState, useContext } from "react";
import { v4 as uuidv4 } from "uuid";

const SavedCompanyContext = createContext();

export function SavedCompanyProvider({ children }) {
  const [groups, setGroups] = useState([]);
  const [savedCompanies, setSavedCompanies] = useState([]);

  const addCompanyToGroup = (company, groupId) =>
    setGroups((prevState) =>
      prevState.map((previousGroup) => {
        console.log(previousGroup.companies, company);
        return previousGroup.id === groupId
          ? {
              ...previousGroup,
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

  const saveCompany = (company) =>
    setSavedCompanies((prevState) => [
      company,
      ...prevState.filter(
        (savedCompany) => savedCompany.entry_id !== company.entry_id
      ),
    ]);

  return (
    <SavedCompanyContext.Provider
      value={{
        groups,
        setGroups,
        savedCompanies,
        setSavedCompanies,
        createGroup,
        saveCompany,
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
