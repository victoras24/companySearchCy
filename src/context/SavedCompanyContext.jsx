import React, { createContext, useState, useContext } from "react";
import { v4 as uuidv4 } from "uuid";

const SavedCompanyContext = createContext();

export function SavedCompanyProvider({ children }) {
  const [groups, setGroups] = useState([]);
  const [savedCompanies, setSavedCompanies] = useState([]);

  const addCompanyToGroup = (companyId, groupId) => {
    const draggedCompany = savedCompanies.find(
      (company) => company.entry_id === companyId
    );

    setGroups((prevState) =>
      prevState.map((group) => {
        if (group.id === groupId) {
          const uniqueCompaniesInGroup = group.companies.filter(
            (company) => company.id !== companyId
          );
          console.log(companyId, draggedCompany.entry_id);

          return {
            ...group,
            companies: [
              ...uniqueCompaniesInGroup,
              {
                groupedCompanyName: draggedCompany.organisation_name,
                id: companyId,
              },
            ],
          };
        }
        return group;
      })
    );
  };

  const createGroup = (groupName) => {
    setGroups((prevState) => [
      ...prevState,
      {
        id: `group-${uuidv4()}`,
        name: groupName,
        isExtended: false,
        companies: [],
      },
    ]);
  };

  const saveCompany = (company) => {
    setSavedCompanies((prevState) => {
      const index = prevState.findIndex((c) => c.entry_id === company.entry_id);
      if (index >= 0) {
        return prevState.filter((c) => c.entry_id !== company.entry_id);
      } else {
        return [...prevState, { ...company, isSaved: true }];
      }
    });
  };

  const getCompanyById = (companyId) => {};

  const removeCompanyFromGroup = (companyId, groupId) => {};

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
        removeCompanyFromGroup,
        getCompanyById,
      }}
    >
      {children}
    </SavedCompanyContext.Provider>
  );
}

export function useCompanyContext() {
  return useContext(SavedCompanyContext);
}
