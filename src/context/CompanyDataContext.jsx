import React, { createContext, useState, useContext, useEffect } from "react";
import { fetchCompanyData } from "../api/companiesApi";
// import { fetchAddressData } from "../api/addressApi";
// import { fetchPersonData } from "../api/personsApi";

const CompanyDataContext = createContext();

export function CompanyDataProvider({ children }) {
  const [companyData, setCompanyData] = useState([]);
  const [companySearchInput, setCompanySearchInput] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL = "http://localhost:5173/api";

  useEffect(() => {
    if (!companySearchInput.trim()) {
      console.log("Empty search input, clearing data");
      setCompanyData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log("Starting search for:", companySearchInput);

    const debounce = setTimeout(async () => {
      try {
        const companies = await fetchCompanyData(
          companySearchInput,
          `${BASE_URL}/company/search?q=${encodeURIComponent(
            companySearchInput
          )}`
        );

        if (!companies.length) {
          console.log("No companies found");
          setCompanyData([]);
          return;
        }

        const combinedData = await Promise.all(
          companies.map(async (company) => {
            try {
              const [address, person] = await Promise.all([
                fetchAddressData(
                  `${BASE_URL}/company/address`,
                  company.address_seq_no
                ),
                fetchPersonData(
                  `${BASE_URL}/company/persons`,
                  company.registration_no
                ),
              ]);

              return {
                ...company,
                address: address || [],
                person: person || [],
                isSaved: false,
              };
            } catch (error) {
              console.error(
                `Error fetching details for company ${company.organisation_name}:`,
                error
              );
              return {
                ...company,
                address: [],
                person: [],
                isSaved: false,
              };
            }
          })
        );

        console.log("Combined data:", combinedData);
        setCompanyData(combinedData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setCompanyData([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounce);
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
