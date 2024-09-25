import { useEffect, useState } from "react";
import { fetchCompanyData } from "../api/companiesApi";
import { fetchAddressData } from "../api/addressApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import {
  faBookmark,
  faSearch,
  faTimes,
  faFilter,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { useCompanyContext } from "../context/SavedCompanyContext";

export default function Search() {
  const [companyData, setCompanyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [companySearchInput, setCompanySearchInput] = useState("");
  const [openGroup, setOpenGroup] = useState({});
  const { savedCompanies, saveCompany, groups, addCompanyToGroup } =
    useCompanyContext();
  const corsAnywhereUrl = "http://localhost:8080/";
  const companiesApiUrl = `https://www.data.gov.cy/api/action/datastore/search.json?resource_id=b48bf3b6-51f2-4368-8eaa-63d61836aaa9&q=${companySearchInput}`;
  const addressApiUrl = `https://www.data.gov.cy/api/action/datastore/search.json?resource_id=31d675a2-4335-40ba-b63c-d830d6b5c55d`;

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
            return { ...company, address, isSaved: false };
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

  const companyDataElements = companyData.map((data) => {
    const addressInfo = data.address || [];
    const fullAddress =
      addressInfo
        .map((address) =>
          `${address.street || ""}${address.territory || ""}`.trim()
        )
        .join(", ") || "Address not available";

    const isSaved = savedCompanies.some(
      (company) => company.registration_no === data.registration_no
    );

    const handleOpenGroup = (id) => {
      setOpenGroup((prevState) => ({
        ...prevState,
        [id]: !prevState[id],
      }));
    };

    const handleAddCompanyToGroup = (groupId) => {
      addCompanyToGroup(data.entry_id, groupId);
    };

    const isGroupOpen = openGroup[data.entry_id];

    return (
      <div key={data.registration_no} className="result-container-data">
        <div className="result-container-top-info">
          <h3 className="result-container-company">{data.organisation_name}</h3>
          <div className="status-bookmark-container">
            <p
              className={`result-container-company-status ${
                data.organisation_status === "Εγγεγραμμένη"
                  ? "active"
                  : "inactive"
              }`}
            >
              {data.organisation_status === "Εγγεγραμμένη"
                ? "Active"
                : "Inactive"}
            </p>
            {
              <FontAwesomeIcon
                onClick={() => {
                  saveCompany(data);
                }}
                icon={isSaved ? faBookmark : faBookmarkRegular}
              />
            }
            <FontAwesomeIcon
              className="plus-icon"
              icon={faCirclePlus}
              onClick={() => handleOpenGroup(data.entry_id)}
            />
          </div>
          {isGroupOpen && groups.length > 0 ? (
            <div className="result-container-group-list">
              <ul>
                {groups.map((group) => (
                  <li
                    key={group.id}
                    onClick={() => handleAddCompanyToGroup(group.id)}
                  >
                    {group.name}
                  </li>
                ))}
              </ul>
            </div>
          ) : isGroupOpen && groups.length === 0 ? (
            <div className="result-container-group-list">
              <span>No groups have been created yet.</span>
            </div>
          ) : null}
        </div>
        <p className="result-container-address">{fullAddress}</p>
      </div>
    );
  });

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
          <div className="result-container">{companyDataElements}</div>
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

      <div className="search-footer">
        <p>
          Data sourced from official Cyprus company registries. Updated daily.
        </p>
        <a href="/faq" className="faq-link">
          Frequently Asked Questions
        </a>
      </div>
    </div>
  );
}
