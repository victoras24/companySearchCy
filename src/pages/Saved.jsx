import React, { useState } from "react";
import { useCompanyContext } from "../context/SavedCompanyContext";
import Droppable from "../utils/Droppable";
import Draggable from "../utils/Draggable";
import { DndContext, closestCenter } from "@dnd-kit/core";

export default function Saved() {
  const [isGroup, setIsGroup] = useState(false);
  const [groupName, setGroupName] = useState("");

  const {
    createGroup,
    savedCompanies,
    groups,
    addCompanyToGroup,
    removeCompanyFromGroup,
    getCompanyById,
  } = useCompanyContext();

  const handleCreateGroup = () => {
    if (groupName.trim()) {
      createGroup(groupName);
      setGroupName("");
      setIsGroup(false);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      if (over.id.startsWith("group-")) {
        // Dragging to a group
        addCompanyToGroup(active.id, over.id);
      } else if (over.id === "saved-companies") {
        // Dragging back to saved companies
        groups.forEach((group) => {
          if (group.companies.includes(companyId)) {
            removeCompanyFromGroup(companyId, group.id);
          }
        });
      }
    }
  };

  return (
    <div className="saved-page">
      <h1 className="saved-title">Saved companies</h1>
      <p className="saved-description">
        Find and organize easily Cyprus companies that you have saved.
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
        <DndContext
          onDragEnd={handleDragEnd}
          collisionDetection={closestCenter}
        >
          <div className="saved-companies">
            <Droppable id="saved-companies">
              <h3>Saved companies</h3>
              {savedCompanies.length > 0 ? (
                savedCompanies.map((company) => (
                  <Draggable id={company.entry_id} key={company.entry_id}>
                    <div className="saved-company-container">
                      <span>{company.organisation_name}</span>
                    </div>
                  </Draggable>
                ))
              ) : (
                <span className="saved-companies-empty">
                  No companies saved yet
                </span>
              )}
            </Droppable>
          </div>
          <div className="groups-container">
            {groups.map((group) => (
              <Droppable id={group.id} key={group.id}>
                <div className="group-wrapper">
                  <h3>{group.name}</h3>
                  <ul>
                    {group.companies.map((company) => {
                      return (
                        // <Draggable id={company.id} key={company.id}>
                        <li key={company.id}>{company.groupedCompanyName}</li>
                        // </Draggable>
                      );
                    })}
                  </ul>
                </div>
              </Droppable>
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  );
}
