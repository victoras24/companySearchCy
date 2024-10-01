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
  const [draggedCompany, setDraggedCompany] = useState(null);
  const [targetGroupId, setTargetGroupId] = useState(null);
  const [sourceGroupId, setSourceGroupId] = useState(null);
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

  const hanldeDragStart = (event, draggedCompany, groupId) => {
    setDraggedCompany(draggedCompany);
    setSourceGroupId(groupId);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (event, groupId) => {
    event.dataTransfer.dropEffect = "move";
    setTargetGroupId(groupId);
    event.preventDefault();
  };

  const handleDrop = (event, draggedCompany) => {
    event.preventDefault();

    if (draggedCompany) {
      setGroups((prevState) => {
        return prevState.map((group) => {
          if (group.id === sourceGroupId && group.id === targetGroupId) {
            return group;
          } else if (group.id === sourceGroupId) {
            return {
              ...group,
              companies: group.companies.filter(
                (company) => company.entry_id !== draggedCompany.entry_id
              ),
            };
          } else if (group.id === targetGroupId) {
            return {
              ...group,
              companies: [...group.companies, draggedCompany],
            };
          } else return group;
        });
      });
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
                onDragOver={(event) => handleDragOver(event, group.id)}
                onDrop={(event) => handleDrop(event, draggedCompany)}
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
                      <div className="grouped-companies" key={comp.entry_id}>
                        <li
                          draggable
                          onDragStart={(event) =>
                            hanldeDragStart(event, comp, group.id)
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
