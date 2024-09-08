import { useState, useRef } from "react";
import { useCompanyContext } from "../context/SavedCompanyContext";

export default function Saved() {
  const [isGroup, setIsGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const { groups, setGroups, createGroup, savedCompanies, setSavedCompanies } =
    useCompanyContext();
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const handleCreateGroup = () => {
    if (groupName.trim()) {
      createGroup(groupName);
      setGroupName("");
    }
  };

  const handleDragStart = (e, position, type, groupIndex = null) => {
    dragItem.current = { position, type, groupIndex };
  };

  const handleDragEnter = (e, position, type, groupIndex = null) => {
    dragOverItem.current = { position, type, groupIndex };
  };

  const handleDrop = (e) => {
    if (!dragItem.current || !dragOverItem.current) return;

    const {
      type: draggedType,
      position: draggedPosition,
      groupIndex: draggedGroupIndex,
    } = dragItem.current;
    const {
      type: targetType,
      position: targetPosition,
      groupIndex: targetGroupIndex,
    } = dragOverItem.current;

    let updatedGroups = [...groups];
    let updatedSavedCompanies = [...savedCompanies];

    const getDraggedItem = () => {
      if (draggedType === "company") {
        if (draggedGroupIndex !== null) {
          const company = updatedGroups[draggedGroupIndex].companies.splice(
            draggedPosition,
            1
          )[0];
          return company;
        } else {
          return updatedSavedCompanies.splice(draggedPosition, 1)[0];
        }
      } else {
        return updatedGroups.splice(draggedPosition, 1)[0];
      }
    };

    const draggedItem = getDraggedItem();

    if (targetType === "company") {
      if (targetGroupIndex !== null) {
        if (draggedType === "company") {
          updatedGroups[targetGroupIndex].companies.splice(
            targetPosition,
            0,
            draggedItem
          );
        } else {
          updatedGroups[targetGroupIndex].companies.splice(
            targetPosition,
            0,
            ...draggedItem.companies
          );
        }
      } else {
        if (draggedType === "company") {
          updatedSavedCompanies.splice(targetPosition, 0, draggedItem);
        } else {
          updatedSavedCompanies.splice(
            targetPosition,
            0,
            ...draggedItem.companies
          );
          updatedGroups.splice(draggedPosition, 0, {
            ...draggedItem,
            companies: [],
          });
        }
      }
    } else {
      if (draggedType === "company") {
        updatedGroups[targetPosition].companies.push(draggedItem);
      } else {
        updatedGroups.splice(targetPosition, 0, draggedItem);
      }
    }

    setGroups(updatedGroups);
    setSavedCompanies(updatedSavedCompanies);

    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleDragEnd = () => {
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <div className="saved-page">
      <h1 className="saved-title">Saved companies</h1>
      <p className="saved-description">
        Find and organise easily Cyprus companies that you have saved.
      </p>
      <button
        className="group-add-button"
        onClick={() => setIsGroup((prevState) => !prevState)}
      >
        {isGroup ? "x Close" : "+ Add"}
      </button>
      <div className="saved-groups">
        <div
          className="create-group-container"
          style={isGroup ? { display: "flex" } : { display: "none" }}
        >
          <h3>Name group</h3>
          <input
            type="text"
            value={groupName}
            onChange={(event) => setGroupName(event.target.value)}
          />
          <button onClick={handleCreateGroup}>Create group</button>
        </div>

        <div>
          <h2>Saved Companies</h2>
          {savedCompanies.map((company, index) => (
            <div
              className="saved-company-container"
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, index, "company")}
              onDragEnter={(e) => handleDragEnter(e, index, "company")}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
            >
              <h3>{company.organisation_name}</h3>
            </div>
          ))}
        </div>

        <div className="groups-container">
          {groups.map((group, groupIndex) => (
            <div
              className="group-wrapper"
              key={groupIndex}
              draggable
              onDragStart={(e) => handleDragStart(e, groupIndex, "group")}
              onDragEnter={(e) => handleDragEnter(e, groupIndex, "group")}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
            >
              <h3>{group.name}</h3>

              <div className="group-companies">
                {(group.companies || []).map((company, companyIndex) => (
                  <div
                    key={companyIndex}
                    className="group-company"
                    draggable
                    onDragStart={(e) =>
                      handleDragStart(e, companyIndex, "company", groupIndex)
                    }
                    onDragEnter={(e) =>
                      handleDragEnter(e, companyIndex, "company", groupIndex)
                    }
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onDragEnd={handleDragEnd}
                  >
                    {company.organisation_name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
