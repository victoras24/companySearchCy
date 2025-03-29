import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { fetchCompanyData } from "../api/companiesApi";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import useSaveCompany from "../Hooks/useSaveCompany";
import { useAuth } from "../context/AuthStoreContext";
import useShowToast from "../Hooks/useShowToast";
import Toast from "../components/Toast";
import { Icon } from "../components/Icon";

export default function CompanyDetailPage() {
  const { companyId } = useParams();
  const { state } = useLocation();
  const [companyData, setCompanyData] = useState(state?.company || null);
  const [loading, setLoading] = useState(!state?.company);
  const [error, setError] = useState(false);
  const { user } = useAuth();
  const { handleSaveCompany } = useSaveCompany();
  const { showToast, toastContent, displayToast } = useShowToast();

  // Translation dictionary
  const translations = {
    Εγγεγραμμένη: "Registered",
    Γραμματέας: "Secretary",
    Διευθυντής: "Director",
    Εξουσιοδοτημένο: "Authorized",
    Πρόσωπο: "Person",
    Εταιρεία: "Company",
    Ιδιωτική: "Private",

    Λευκωσία: "Nicosia",
    Λεμεσός: "Limassol",
    Λάρνακα: "Larnaca",
    Πάφος: "Paphos",
    Αμμόχωστος: "Famagusta",
    Κερύνεια: "Kyrenia",

    Κύπρος: "Cyprus",
  };

  // Translation function
  const translate = (text) => {
    return translations[text] || text;
  };

  // Greek to English transliteration map
  const greekToEnglishMap = {
    Α: "A",
    Β: "V",
    Γ: "G",
    Δ: "D",
    Ε: "E",
    Ζ: "Z",
    Η: "I",
    Θ: "TH",
    Ι: "I",
    Κ: "K",
    Λ: "L",
    Μ: "M",
    Ν: "N",
    Ξ: "X",
    Ο: "O",
    Π: "P",
    Ρ: "R",
    Σ: "S",
    Τ: "T",
    Υ: "Y",
    Φ: "F",
    Χ: "CH",
    Ψ: "PS",
    Ω: "O",
    α: "a",
    β: "v",
    γ: "g",
    δ: "d",
    ε: "e",
    ζ: "z",
    η: "i",
    θ: "th",
    ι: "i",
    κ: "k",
    λ: "l",
    μ: "m",
    ν: "n",
    ξ: "x",
    ο: "o",
    π: "p",
    ρ: "r",
    σ: "s",
    τ: "t",
    υ: "y",
    φ: "f",
    χ: "ch",
    ψ: "ps",
    ω: "o",
    ς: "s",
    Ά: "A",
    Έ: "E",
    Ή: "I",
    Ί: "I",
    Ό: "O",
    Ύ: "Y",
    Ώ: "O",
    ά: "a",
    έ: "e",
    ή: "i",
    ί: "i",
    ό: "o",
    ύ: "y",
    ώ: "o",
    ϊ: "i",
    ϋ: "y",
    ΐ: "i",
    ΰ: "y",
  };

  // Transliteration function
  const transliterate = (text) => {
    return text
      .split("")
      .map((char) => greekToEnglishMap[char] || char)
      .join("");
  };

  useEffect(() => {
    if (!companyData) {
      fetchCompanyDetail(companyId);
    }
  }, [companyId, companyData]);

  const fetchCompanyDetail = async (id) => {
    try {
      setLoading(true);
      const companyUrl = `https://www.data.gov.cy/api/action/datastore/search.json?resource_id=b48bf3b6-51f2-4368-8eaa-63d61836aaa9&q=${id}`;

      const [company] = await fetchCompanyData(id, corsAnywhereUrl, companyUrl);
      if (!company) {
        throw new Error("Company not found");
      }

      setCompanyData({ ...company });
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

  const fullAddress =
    companyData.street || companyData.territory || companyData.building
      ? [companyData.street, companyData.building, companyData.territory].join(
          ""
        )
      : "Address not available";

  const isSaved = (company) => {
    return user?.savedCompanies.some((saved) => saved.id === company.id);
  };

  console.log(companyData);

  return (
    <div className="company-detail-page">
      <p className="company-detail-desc">
        This page provides comprehensive information about the company,
        including its incorporation date, registered address, and a list of key
        individuals involved, such as executives and board members. Explore
        essential data that offers insights into the company’s structure,
        leadership, and location.
      </p>
      <div className="company-detail-overview">
        <h2>Overview</h2>
        <div className="company-detail-name-status">
          <h1>{transliterate(companyData.name)}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <p
              className={`company-detail-status ${
                companyData.organisationStatus === "Εγγεγραμμένη"
                  ? "active"
                  : "inactive"
              }`}
            >
              {companyData.organisationStatus === "Εγγεγραμμένη"
                ? "Active"
                : "Inactive"}
            </p>
            <Icon
              style="text-lg"
              symbol={isSaved(companyData) ? faBookmark : faBookmarkRegular}
              onClick={(e) => {
                e.preventDefault();
                handleSaveCompany(companyData, displayToast);
              }}
            />
          </div>
        </div>
        <div className="company-detail-address">
          <p className="company-detail-registration-date">
            Incorporated on {companyData.registrationDate}
          </p>
          {fullAddress ? <p>{fullAddress}</p> : <p>No address available</p>}
        </div>
        {/* <div className="company-detail-keypeople">
          <h2>Key People</h2>
          {Array.isArray(person) && person.length > 0 ? (
            <ul>
              {person.map((p) => (
                <li key={p.entry_id}>
                  <p>Name: {transliterate(p.person_or_name)}</p>
                  <p>Position: {translate(p.official_position)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No person data available</p>
          )}
        </div> */}
      </div>
      {showToast && <Toast {...toastContent} />}
    </div>
  );
}
