import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faTimes,
  faFilter,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import { NavLink } from "react-router-dom";
import useShowToast from "../../Hooks/useShowToast";
import Toast from "../../components/Toast";
import useSaveCompany from "../../Hooks/useSaveCompany";
import { useAuth } from "../../context/AuthStoreContext";
import { Input } from "../../components/Input";
import React, { useEffect, useState } from "react";
import SearchModel from "./Search_model";
import { observer } from "mobx-react";

const Search = observer(() => {
  const { user } = useAuth();
  const { handleSaveCompany, isUpdating } = useSaveCompany();
  const { showToast, toastContent, displayToast } = useShowToast();

  const [model] = useState(() => new SearchModel(""));

  useEffect(() => {
    model.onInput();
  }, [model.organisationName]);

  const isCompanySaved = (companyId) => {
    return user?.savedCompanies.some((saved) => saved.id === companyId.id);
  };
  return (
    <div className="search-page">
      <h1 className="search-title">Cyprus Company Search</h1>
      <p className="search-description">
        Find detailed information about companies registered in Cyprus.
      </p>

      <div className="search-container">
        <div className="input-container">
          <Input
            primaryIcon={faSearch}
            secondaryIcon={faFilter}
            cleanInputIcon={faTimes}
            iconClass="search-input-icon"
            inputChange={model.handleInputChange}
            loading={model.isLoading}
            cleanInputEvent={() => model.setOrganisationName("")}
            inputText={model.organisationName}
            value={model.organisationName}
            placeholder="Enter company's name"
          />
        </div>
        {model.organisationData.length === 0 &&
        model.organisationName.trim() === "" ? (
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
            {model.organisationData.map((company) => {
              return (
                <NavLink
                  to={`/search/${company.registrationNo}`}
                  key={company.id}
                  state={{ company }}
                  style={{ textDecoration: "none" }}
                >
                  <div className="result-container-data">
                    <div className="result-container-top-info">
                      <h3 className="result-container-company m-0">
                        {company.name}
                      </h3>
                      <div className="status-bookmark-container">
                        <p
                          className={`result-container-company-status ${
                            company.organisationStatus === "Εγγεγραμμένη"
                              ? "active"
                              : "inactive"
                          } m-0`}
                        >
                          {company.organisationStatus === "Εγγεγραμμένη"
                            ? "Active"
                            : "Inactive"}
                        </p>
                        <FontAwesomeIcon
                          icon={
                            isCompanySaved(company)
                              ? faBookmark
                              : faBookmarkRegular
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            handleSaveCompany(company, displayToast);
                          }}
                        />
                      </div>
                    </div>
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
});

export default Search;
