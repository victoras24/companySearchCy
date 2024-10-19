import React, { useState, useEffect, useRef, useCallback } from "react";
import { useCompanyContext } from "../context/SavedCompanyContext";
import { Reorder } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareMinus, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";

export default function Favorites() {
  const [openGroup, setOpenGroup] = useState({});
  const { savedCompanies, setSavedCompanies, groups, addCompanyToGroup } =
    useCompanyContext();
  const plusBtnRefs = useRef({});
  const groupListRefs = useRef({});

  const deleteCompany = useCallback(
    (companyId) => {
      setSavedCompanies((prevState) =>
        prevState.filter((company) => company.entry_id !== companyId)
      );
    },
    [setSavedCompanies]
  );

  useEffect(() => {
    function closeAddToGroup(e) {
      Object.keys(openGroup).forEach((id) => {
        if (
          openGroup[id] &&
          plusBtnRefs.current[id] &&
          !plusBtnRefs.current[id].contains(e.target) &&
          groupListRefs.current[id] &&
          !groupListRefs.current[id].contains(e.target)
        ) {
          setOpenGroup((prevState) => {
            return {
              ...prevState,
              [id]: false,
            };
          });
        }
      });
    }

    document.body.addEventListener("click", closeAddToGroup);
    return () => {
      document.body.removeEventListener("click", closeAddToGroup);
    };
  }, [openGroup]);

  const handleOpenGroup = useCallback((id) => {
    setOpenGroup((prevState) => {
      const newState = {
        ...prevState,
        [id]: !prevState[id],
      };
      return newState;
    });
  }, []);

  const renderGroupList = (company, isGroupOpen) => {
    if (!isGroupOpen) return null;

    return (
      <div
        className="result-container-group-list"
        ref={(el) => (groupListRefs.current[company.entry_id] = el)}
      >
        {groups.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {groups.map((group) => (
              <li
                key={group.id}
                onClick={() => handleAddCompanyToGroup(company, group.id)}
                style={{ cursor: "pointer", padding: "5px" }}
              >
                {group.name}
              </li>
            ))}
          </ul>
        ) : (
          <div>
            <span>No groups have been created yet.</span>
            <NavLink to={"/organizer"}>
              <button>Create group</button>
            </NavLink>
          </div>
        )}
      </div>
    );
  };

  const handleAddCompanyToGroup = useCallback(
    (company, groupId) => {
      addCompanyToGroup(company, groupId);
      setOpenGroup((prevState) => ({
        ...prevState,
        [company.entry_id]: false,
      }));
    },
    [addCompanyToGroup]
  );

  return (
    <div className="saved-page">
      <h1 className="saved-title">Favorites</h1>
      <p className="saved-description">
        View and manage all your marked favorite companies in one place. Easily
        add, remove, or explore details about your top choices.
      </p>

      <Reorder.Group values={savedCompanies} onReorder={setSavedCompanies}>
        <div className="saved-companies">
          <h2>Saved Companies</h2>
          {savedCompanies.length > 0 ? (
            savedCompanies.map((company) => {
              const isGroupOpen = openGroup[company.entry_id];

              return (
                <Reorder.Item key={company.entry_id} value={company}>
                  <div
                    className="saved-company-container"
                    style={{ position: "relative" }}
                  >
                    <span>{company.organisation_name}</span>
                    <div className="saved-company-icons">
                      <FontAwesomeIcon
                        className="saved-company-plus-icon"
                        icon={faCirclePlus}
                        ref={(el) =>
                          (plusBtnRefs.current[company.entry_id] = el)
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenGroup(company.entry_id);
                        }}
                      />
                      {renderGroupList(company, isGroupOpen)}
                      <FontAwesomeIcon
                        className="saved-company-delete"
                        icon={faSquareMinus}
                        onClick={() => deleteCompany(company.entry_id)}
                      />
                    </div>
                  </div>
                </Reorder.Item>
              );
            })
          ) : (
            <span className="saved-companies-empty">
              No companies in favorites yet.
            </span>
          )}
        </div>
      </Reorder.Group>
    </div>
  );
}
