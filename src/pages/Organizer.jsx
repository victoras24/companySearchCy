import { useState } from "react";
import { useCompanyContext } from "../context/SavedCompanyContext";
import { Reorder } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareMinus,
  faAngleDown,
  faAngleUp,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

export default function Organizer() {
  const [isGroup, setIsGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [draggedCompanyId, setDraggedCompanyId] = useState(null);
  const { createGroup, groups, setGroups } = useCompanyContext();

  const handleCreateGroup = () => {
    if (groupName.trim()) {
      createGroup(groupName);
      setGroupName("");
      setIsGroup(false);
    }
  };

  const handleExtendGroup = (groupId) => {
    setGroups((prevState) =>
      prevState.map((group) =>
        group.id === groupId
          ? { ...group, isExtended: !group.isExtended }
          : group
      )
    );
  };

  const deleteGroup = (groupId) => {
    setGroups((prevState) => prevState.filter((group) => group.id !== groupId));
  };

  const deleteGroupedCompany = (groupId, companyId) => {
    setGroups((prevState) =>
      prevState.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            companies: group.companies.filter(
              (company) => company.entry_id !== companyId
            ),
          };
        }
        return group;
      })
    );
  };

  const hanldeDragStart = (event, companyId) => {
    setDraggedCompanyId(companyId);
    console.log(companyId);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (event) => {
    event.dataTransfer.dropEffect = "move";
    event.preventDefault();
  };

  const handleDrop = (event, targetGroupId) => {
    event.preventDefault();

    if (draggedCompanyId) {
      setGroups((prevState) => {
        let draggedCompany;
        const updatedGroups = prevState.map((group) => {
          const companyIndex = group.companies.findIndex(
            (company) => company.entry_id === draggedCompanyId
          );
          if (companyIndex !== -1) {
            draggedCompany = group.companies[companyIndex];
            return {
              ...group,
              companies: group.companies.filter(
                (_, index) => index !== companyIndex
              ),
            };
          }
          return group;
        });

        return updatedGroups.map((group) => {
          if (group.id === targetGroupId && draggedCompany) {
            return {
              ...group,
              companies: [...group.companies, draggedCompany],
            };
          }
          return group;
        });
      });

      setDraggedCompanyId(null);
    }
  };

  return (
    <div className="organizer-page">
      <h1 className="saved-title">Company organizer</h1>
      <p className="saved-description">
        Create and manage groups to efficiently organize your saved companies.
        Categorize your favorites for easy access and streamlined management.
      </p>
      <button
        className="group-add-button"
        onClick={() => setIsGroup((prevState) => !prevState)}
      >
        {isGroup ? "x Close" : "+ Add"}
      </button>
      <div
        className="create-group-container"
        style={isGroup ? { display: "flex" } : { display: "none" }}
      >
        <h2>Name group</h2>
        <input
          type="text"
          value={groupName}
          onChange={(event) => setGroupName(event.target.value)}
        />
        <button onClick={handleCreateGroup}>Create group</button>
      </div>
      <Reorder.Group axis="y" values={groups} onReorder={setGroups}>
        <div className="groups-container">
          {groups.map((group) => (
            <Reorder.Item key={group.id} value={group}>
              <div
                className="group-wrapper"
                onDragOver={handleDragOver}
                onDrop={(event) => handleDrop(event, group.id)}
              >
                <div className="group-wrapper-top-section">
                  <h2>{group.name}</h2>
                  <div>
                    <button
                      onClick={() => handleExtendGroup(group.id)}
                      className="group-extend-button"
                    >
                      <FontAwesomeIcon
                        icon={group.isExtended ? faAngleUp : faAngleDown}
                        className="group-arrow-down"
                      />
                    </button>
                    <button
                      className="group-delete-button"
                      onClick={() => deleteGroup(group.id)}
                    >
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        className="group-trash-can"
                      />
                    </button>
                  </div>
                </div>
                {group.isExtended && (
                  <ul>
                    {group.companies.map((comp) => (
                      <div className="grouped-companies">
                        <li
                          key={comp.entry_id}
                          draggable
                          onDragStart={(event) =>
                            hanldeDragStart(event, comp.entry_id)
                          }
                        >
                          {comp.organisation_name}
                        </li>
                        <FontAwesomeIcon
                          icon={faSquareMinus}
                          className="saved-company-delete"
                          onClick={() =>
                            deleteGroupedCompany(group.id, comp.entry_id)
                          }
                        />
                      </div>
                    ))}
                  </ul>
                )}
              </div>
            </Reorder.Item>
          ))}
        </div>
      </Reorder.Group>
    </div>
  );
}
