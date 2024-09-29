import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import { useCompanyContext } from "../context/SavedCompanyContext";

export default function CompanyDataResult({ data }) {
  const [openGroup, setOpenGroup] = useState({});
  const plusBtnRef = useRef();
  const groupListRef = useRef();
  const { savedCompanies, setSavedCompanies, groups, addCompanyToGroup } =
    useCompanyContext();

  const addressInfo = data.address || [];
  const fullAddress =
    addressInfo
      .map((address) =>
        `${address.street || ""}${address.territory || ""}`.trim()
      )
      .join(", ") || "Address not available";

  const isSaved = savedCompanies.some(
    (company) => company.entry_id === data.entry_id
  );

  const saveCompany = (company) => {
    setSavedCompanies((prevState) => {
      const isSaved = savedCompanies.some(
        (company) => company.entry_id === data.entry_id
      );

      if (isSaved) {
        return prevState.filter(
          (savedCompany) => savedCompany.entry_id !== company.entry_id
        );
      } else {
        return [company, ...prevState];
      }
    });
  };

  useEffect(() => {
    function closeAddToGroup(e) {
      if (
        plusBtnRef.current &&
        !plusBtnRef.current.contains(e.target) &&
        groupListRef.current &&
        !groupListRef.current.contains(e.target)
      ) {
        setOpenGroup({});
      }
    }

    document.body.addEventListener("click", closeAddToGroup);

    return () => {
      document.body.removeEventListener("click", closeAddToGroup);
    };
  }, []);

  const handleOpenGroup = (id) => {
    setOpenGroup((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleAddCompanyToGroup = (groupId) => {
    addCompanyToGroup(data, groupId);
    setOpenGroup({});
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
            ref={plusBtnRef}
            onClick={() => handleOpenGroup(data.entry_id)}
          />
        </div>
        {isGroupOpen && groups.length > 0 ? (
          <div className="result-container-group-list" ref={groupListRef}>
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
          <div className="result-container-group-list" ref={groupListRef}>
            <span>No groups have been created yet.</span>
          </div>
        ) : null}
      </div>
      <p className="result-container-address">{fullAddress}</p>
    </div>
  );
}
