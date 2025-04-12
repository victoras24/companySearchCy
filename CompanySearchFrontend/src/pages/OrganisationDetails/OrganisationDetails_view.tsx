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
          <h1>{model.detailedData?.name}</h1>
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
              size="xl"
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
                  <p>Name: {p.person_or_name}</p>
                  <p>Position: {p.official_position}</p>
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
