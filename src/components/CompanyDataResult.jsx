import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import { useCompanyContext } from "../context/SavedCompanyContext";

export default function CompanyDataResult({data}) {
    const [openGroup, setOpenGroup] = useState({});
    const { savedCompanies, saveCompany, groups, addCompanyToGroup } =
      useCompanyContext();

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
      ;
}
