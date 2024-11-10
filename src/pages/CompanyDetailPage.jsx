import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
// import { fetchPersonData } from "../api/personsApi";
// import { fetchAddressData } from "../api/addressApi";
import { fetchCompanyData } from "../api/companiesApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import Toast from "../components/Toast";
import useShowToast from "../Hooks/useShowToast";
import useSaveCompany from "../Hooks/useSaveCompany";
import { useAuth } from "../context/AuthStoreContext";
import { translations, transliterate } from "../utils/translations";

export default function CompanyDetailPage() {
  const { companyId } = useParams();
  const { state } = useLocation();
  const [companyData, setCompanyData] = useState(state?.company || null);
  const [loading, setLoading] = useState(!state?.company);
  const [error, setError] = useState(false);

  const { showToast, toastContent, displayToast } = useShowToast();
  const { handleSaveCompany } = useSaveCompany();
  const { user } = useAuth();

  useEffect(() => {
    if (!companyData && companyId) {
      fetchCompanyDetail(companyId);
    }
  }, [companyId, companyData]);

  const fetchCompanyDetail = async (id) => {
    try {
      setLoading(true);
      setError(false);

      // Fetch the company data
      const companies = await fetchCompanyData(id);
      console.log("Companies response:", companies);

      if (!companies || companies.length === 0) {
        throw new Error("Company not found");
      }

      const companyDetails = companies[0];
      console.log("Company details:", companyDetails);

      // Fetch address and person data
      const addressResponse = await fetchAddressData(
        companyDetails.address_seq_no
      );
      console.log("Address response:", addressResponse);

      const personResponse = await fetchPersonData(
        companyDetails.registration_no
      );
      console.log("Person response:", personResponse);

      // Combine the data
      const combinedData = {
        ...companyDetails,
        address: addressResponse[0] || null,
        person: personResponse || [],
      };

      console.log("Combined data:", combinedData);
      setCompanyData(combinedData);
    } catch (err) {
      console.error("Error fetching company data:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Failed to load company data.</p>;
  if (!companyData) return <p>No data found for this company.</p>;

  const {
    organisation_name,
    organisation_status,
    registration_date,
    address,
    person,
    entry_id,
  } = companyData;

  const addressDetails = address || {};
  const formattedAddress =
    `${addressDetails.street || ""}, ${addressDetails.building || ""}, ${
      addressDetails.territory || ""
    }`.replace(/,\s*,|,\s*$/, "") || "No address available";

  const isSaved = user?.savedCompanies.some(
    (savedCompany) => savedCompany.entry_id === entry_id
  );

  return (
    <div className="company-detail-page">
      <p className="company-detail-desc">
        This page provides comprehensive information about the company,
        including its incorporation date, registered address, and a list of key
        individuals involved, such as executives and board members.
      </p>
      <div className="company-detail-overview">
        <h2>Overview</h2>
        <div className="company-detail-name-status">
          <h1>{transliterate(organisation_name)}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <p
              className={`company-detail-status ${
                organisation_status === "Εγγεγραμμένη" ? "active" : "inactive"
              }`}
            >
              {organisation_status === "Εγγεγραμμένη" ? "Active" : "Inactive"}
            </p>
            <FontAwesomeIcon
              className="company-detail-bookmark"
              icon={isSaved ? faBookmark : faBookmarkRegular}
              onClick={(e) => {
                e.preventDefault();
                handleSaveCompany(companyData, displayToast);
              }}
            />
          </div>
        </div>
        <div className="company-detail-address">
          <p className="company-detail-registration-date">
            Incorporated on {registration_date}
          </p>
          <p>{formattedAddress}</p>
        </div>
        <div className="company-detail-keypeople">
          <h2>Key People</h2>
          {person.length > 0 ? (
            <ul>
              {person.map((p) => (
                <li key={p.entry_id}>
                  <p>Name: {transliterate(p.person_or_organisation_name)}</p>
                  <p>Position: {translations(p.official_position)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No person data available</p>
          )}
        </div>
      </div>
      {showToast && <Toast {...toastContent} />}
    </div>
  );
}
