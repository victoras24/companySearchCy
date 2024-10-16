import { useEffect, useState } from "react";
import { fetchCompanyData } from "../api/companiesApi";
import { fetchAddressData } from "../api/addressApi";
import { fetchPersonData } from "../api/personsApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes, faFilter } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import CompanyDataResult from "../components/CompanyDataResult";

export default function Search() {
  const [companyData, setCompanyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [companySearchInput, setCompanySearchInput] = useState("");

  const corsAnywhereUrl = "http://localhost:8080/";
  const companiesApiUrl = `https://www.data.gov.cy/api/action/datastore/search.json?resource_id=b48bf3b6-51f2-4368-8eaa-63d61836aaa9&q=${companySearchInput}`;
  const addressApiUrl = `https://www.data.gov.cy/api/action/datastore/search.json?resource_id=31d675a2-4335-40ba-b63c-d830d6b5c55d`;
  const personApiUrl = `https://data.gov.cy/api/action/datastore/search.json?resource_id=a1deb65d-102b-4e8e-9b9c-5b357d719477`;

  useEffect(() => {
    if (companySearchInput.trim() !== "") {
      setLoading(true);
      const debouce = setTimeout(async () => {
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
        console.log(combinedData);
        setCompanyData(combinedData);
        setLoading(false);
      }, 300);
      return () => {
        clearTimeout(debouce);
      };
    } else {
      setCompanyData([]);
      setLoading(false);
    }
  }, [companySearchInput, corsAnywhereUrl, companiesApiUrl, addressApiUrl]);

  const handleInputChange = (event) => {
    setCompanySearchInput(event.target.value);
  };

  return (
    <div className="search-page">
      <h1 className="search-title">Cyprus Company Search</h1>
      <p className="search-description">
        Find detailed information about companies registered in Cyprus.
      </p>

      <div className="search-container">
        <div className="input-container">
          <FontAwesomeIcon icon={faSearch} className="input-icon" />
          <input
            type="text"
            onChange={handleInputChange}
            value={companySearchInput}
            className="search-container-input"
            placeholder="Enter company's name"
          />
          {companySearchInput && (
            <FontAwesomeIcon
              icon={faTimes}
              className="input-icon clear-icon"
              onClick={() => setCompanySearchInput("")}
            />
          )}
          {loading ? <span className="loader"></span> : ""}
          <FontAwesomeIcon icon={faFilter} className="input-icon filter-icon" />
        </div>

        {companyData.length === 0 && companySearchInput.trim() === "" && (
          <div className="search-tips">
            <h2>Search Tips:</h2>
            <ul>
              <li>Enter the full or partial name of the company</li>
              <li>Results will show company name, status, and address</li>
              <li>Click on a result to view more details</li>
              <li>Use the filter icon to refine your search</li>
            </ul>
          </div>
        )}

        {companyData.length > 0 ? (
          <div className="result-container">
            {companyData.map((company) => {
              return (
                <NavLink
                  to={`/search/${company.entry_id}`}
                  state={{ company }}
                  style={{ textDecoration: "none" }}
                >
                  <CompanyDataResult key={company.entry_id} data={company} />
                </NavLink>
              );
            })}
          </div>
        ) : (
          companySearchInput.trim() !== "" &&
          !loading && (
            <div className="no-results">
              <p>
                No companies found matching your search. Try adjusting your
                search terms.
              </p>
            </div>
          )
        )}
      </div>

      {/* <div className="search-footer">
        <p>
          Data sourced from official Cyprus company registries. Updated daily.
        </p>
        <a href="/faq" className="faq-link">
          Frequently Asked Questions
        </a>
      </div> */}
    </div>
  );
}
