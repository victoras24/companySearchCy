import React, { createContext, useState, useContext, useEffect } from "react";

const CompanyDataContext = createContext();

export function CompanyDataProvider({ children }) {
  const [companyData, setCompanyData] = useState([]);
  const [companySearchInput, setCompanySearchInput] = useState("");
  const [loading, setLoading] = useState(false);

  const companiesApiUrl = `http://localhost:5066/api/company/${companySearchInput}`;

  useEffect(() => {
    if (companySearchInput.trim() !== "") {
      setLoading(true);
      const debounce = setTimeout(async () => {
        try {
          const companies = await fetchCompanyData(companiesApiUrl);
          setCompanyData(companies);
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
