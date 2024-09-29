import React, { useState } from "react";
import { useCompanyContext } from "../context/SavedCompanyContext";
import { Reorder } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareMinus } from "@fortawesome/free-solid-svg-icons";

export default function Favorites() {
  const { savedCompanies, setSavedCompanies } = useCompanyContext();

  const deleteCompany = (companyId) => {
    setSavedCompanies((prevState) =>
      prevState.filter((company) => company.entry_id !== companyId)
    );
  };

  return (
    <div className="saved-page">
      <h1 className="saved-title">Favorites</h1>
      <p className="saved-description">
        View and manage all your marked favorite companies in one place. Easily
        add, remove, or explore details about your top choices.
      </p>
      <Reorder.Group values={savedCompanies} onReorder={setSavedCompanies}>
        <div className="saved-companies">
          <h2>Saved companies</h2>
          {savedCompanies.length > 0 ? (
            savedCompanies.map((company) => (
              <Reorder.Item key={company.entry_id} value={company}>
                <div className="saved-company-container">
                  <span>{company.organisation_name}</span>
                  <FontAwesomeIcon
                    className="saved-company-delete"
                    icon={faSquareMinus}
                    onClick={() => deleteCompany(company.entry_id)}
                  />
                </div>
              </Reorder.Item>
            ))
          ) : (
            <span className="saved-companies-empty">
              No companies in favorites yet
            </span>
          )}
        </div>
      </Reorder.Group>
    </div>
  );
}
