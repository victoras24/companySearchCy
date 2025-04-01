import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import useSaveCompany from "../../Hooks/useSaveCompany";
import { useAuth } from "../../context/AuthStoreContext";
import useShowToast from "../../Hooks/useShowToast";
import Toast from "../../components/Toast";
import { Icon } from "../../components/Icon";
import { observer } from "mobx-react";
import OrganisationDetailsModel from "./OrganisationDetails_model";
import moment from "moment";

const OrganisationDetails: React.FC = observer(() => {
  const { companyId } = useParams();
  const registrationNo = parseInt(companyId || "", 10);
  const { user } = useAuth();
  const { handleSaveCompany } = useSaveCompany();
  const { showToast, toastContent, displayToast } = useShowToast();
  const [model] = useState(() => new OrganisationDetailsModel(registrationNo));

  useEffect(() => {
    model.onMount();
  }, []);

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

  const translate = (text) => {
    return translations[text] || text;
  };

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

  const transliterate = (text) => {
    return text
      .split("")
      .map((char) => greekToEnglishMap[char] || char)
      .join("");
  };

  const parseOfficials = (officialsString) => {
    if (!officialsString) return [];
    return officialsString
      .split(",")
      .map((entry) => {
        const parts = entry.split(" (");
        if (parts.length === 2) {
          const [name, position] = parts;
          return {
            person_or_name: name.trim(),
            official_position: position.replace(")", "").trim(),
          };
        }
        return null;
      })
      .filter(Boolean);
  };

  const officials = parseOfficials(model.detailedData?.officials);

  if (model.isLoading) return <p>Loading...</p>;
  if (!model) return <p>No data found for this company.</p>;

  const fullAddress =
    model.detailedData?.street ||
    model.detailedData?.territory ||
    model.detailedData?.building
      ? [
          model.detailedData?.street,
          model.detailedData?.building,
          model.detailedData?.territory,
        ].join("")
      : "Address not available";

  const isSaved = (company) => {
    return user?.savedCompanies.some((saved) => saved.id === company.id);
  };

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
          <h1>{transliterate(model.detailedData?.name)}</h1>
          <div className="d-flex justify-content-start align-items-center">
            <p
              className={`company-detail-status ${
                model.detailedData?.status === "Εγγεγραμμένη"
                  ? "active"
                  : "inactive"
              } m-0`}
            >
              {model.detailedData?.status === "Εγγεγραμμένη"
                ? "Active"
                : "Inactive"}
            </p>
            <Icon
              style="company-detail__icon text-lg"
              symbol={
                isSaved(model.detailedData) ? faBookmark : faBookmarkRegular
              }
              onClick={(e) => {
                e.preventDefault();
                handleSaveCompany(model.detailedData, displayToast);
              }}
            />
          </div>
        </div>
        <div className="company-detail-address">
          <p className="company-detail-registration-date">
            Incorporated on{" "}
            {moment(model.detailedData?.registrationDate).format("L")}
          </p>
          {fullAddress ? <p>{fullAddress}</p> : <p>No address available</p>}
        </div>
        <div className="company-detail-keypeople">
          <h2>Key People</h2>
          {Array.isArray(officials) && officials.length > 0 ? (
            <ul>
              {officials.map((p, index) => (
                <li key={index}>
                  <p>Name: {transliterate(p.person_or_name)}</p>
                  <p>Position: {translate(p.official_position)}</p>
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
});

export default OrganisationDetails;
