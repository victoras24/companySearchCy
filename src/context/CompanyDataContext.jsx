import React, { createContext, useState, useContext, useEffect } from "react";
import { fetchCompanyData } from "../api/companiesApi";
import { fetchAddressData } from "../api/addressApi";
import { fetchPersonData } from "../api/personsApi";

const CompanyDataContext = createContext();

export function CompanyDataProvider({ children }) {
  const [companyData, setCompanyData] = useState([]);
  const [companySearchInput, setCompanySearchInput] = useState("");
  const [loading, setLoading] = useState(false);

  const corsAnywhereUrl = "http://localhost:8080/";
  const companiesApiUrl = `https://www.data.gov.cy/api/action/datastore/search.json?resource_id=b48bf3b6-51f2-4368-8eaa-63d61836aaa9&q=${companySearchInput}`;
  const addressApiUrl = `https://www.data.gov.cy/api/action/datastore/search.json?resource_id=31d675a2-4335-40ba-b63c-d830d6b5c55d`;
  const personApiUrl = `https://data.gov.cy/api/action/datastore/search.json?resource_id=a1deb65d-102b-4e8e-9b9c-5b357d719477`;

  useEffect(() => {
    if (companySearchInput.trim() !== "") {
      setLoading(true);
      const debounce = setTimeout(async () => {
        try {
          const companies = await fetchCompanyData(
            companySearchInput,
            corsAnywhereUrl,
            companiesApiUrl
          );
          const combinedData = await Promise.all(
            companies.map(async (company) => {
              const address = await fetchAddressData(
                corsAnywhereUrl,
                addressApiUrl,
                company.address_seq_no
              );
              const person = await fetchPersonData(
                corsAnywhereUrl,
                personApiUrl,
                company.registration_no
              );
              return { ...company, address, person, isSaved: false };
            })
          );
          setCompanyData(combinedData);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        } finally {
          setLoading(false);
        }
      }, 300);

      return () => {
        clearTimeout(debounce);
      };
    } else {
      setCompanyData([]);
      setLoading(false);
    }
  }, [companySearchInput]);

  const handleInputChange = (event) => {
    setCompanySearchInput(event.target.value);
  };

  return (
    <CompanyDataContext.Provider
      value={{
        companyData,
        companySearchInput,
        handleInputChange,
        loading,
        setCompanySearchInput,
      }}
    >
      {children}
    </CompanyDataContext.Provider>
  );
}

export function useCompanyDataContext() {
  return useContext(CompanyDataContext);
}
