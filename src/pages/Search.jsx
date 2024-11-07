import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faTimes,
  faFilter,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import { NavLink } from "react-router-dom";
import { useCompanyDataContext } from "../context/CompanyDataContext";
import useShowToast from "../Hooks/useShowToast";
import Toast from "../components/Toast";
import useSaveCompany from "../Hooks/useSaveCompany";
import { useAuth } from "../context/AuthStoreContext";

export default function Search() {
  const {
    companyData,
    companySearchInput,
    handleInputChange,
    loading,
    setCompanySearchInput,
  } = useCompanyDataContext();
  const { user } = useAuth();
  const { handleSaveCompany, isUpdating } = useSaveCompany();
  const { showToast, toastContent, displayToast } = useShowToast();
  const isCompanySaved = (companyId) => {
    return user.savedCompanies.some(
      (savedCompany) => savedCompany.entry_id === companyId
    );
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
          {loading && <span className="loader"></span>}
          <FontAwesomeIcon icon={faFilter} className="input-icon filter-icon" />
        </div>

        {companyData.length === 0 && companySearchInput.trim() === "" ? (
          <div className="search-tips">
            <h2>Search Tips:</h2>
            <ul>
              <li>Enter the full or partial name of the company</li>
              <li>Results will show company name, status, and address</li>
              <li>Click on a result to view more details</li>
              <li>Use the filter icon to refine your search</li>
            </ul>
          </div>
        ) : (
          <div className="result-container">
            {companyData.map((company) => {
              const isFavorite = isCompanySaved(company.entry_id);

              const addressInfo = company.address || [];
              const fullAddress =
                addressInfo
                  .map((address) =>
                    `${address.street || ""} ${address.territory || ""}`.trim()
                  )
                  .join(", ") || "Address not available";

              return (
                <NavLink
                  to={`/search/${company.entry_id}`}
                  key={company.entry_id}
                  state={{ company }}
                  style={{ textDecoration: "none" }}
                >
                  <div className="result-container-data">
                    <div className="result-container-top-info">
                      <h3 className="result-container-company">
                        {company.organisation_name}
                      </h3>
                      <div className="status-bookmark-container">
                        <p
                          className={`result-container-company-status ${
                            company.organisation_status === "Εγγεγραμμένη"
                              ? "active"
                              : "inactive"
                          }`}
                        >
                          {company.organisation_status === "Εγγεγραμμένη"
                            ? "Active"
                            : "Inactive"}
                        </p>
                        <FontAwesomeIcon
                          icon={isFavorite ? faBookmark : faBookmarkRegular}
                          onClick={(e) => {
                            e.preventDefault();
                            handleSaveCompany(company, displayToast);
                          }}
                        />
                      </div>
                    </div>
                    <p className="result-container-address">{fullAddress}</p>
                  </div>
                </NavLink>
              );
            })}
          </div>
        )}
      </div>
      {showToast && <Toast {...toastContent} />}
    </div>
  );
}
