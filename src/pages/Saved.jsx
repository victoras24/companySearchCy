import React, { useState } from "react";
import { useCompanyContext } from "../context/SavedCompanyContext";
import Droppable from "../utils/Droppable";
import Draggable from "../utils/Draggable";
import Sortable from "../utils/Sortable";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";

export default function Saved() {
  const [isGroup, setIsGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [activeGroup, setActiveGroup] = useState(null);

  const {
    createGroup,
    savedCompanies,
    groups,
    setGroups,
    addCompanyToGroup,
    setSavedCompanies,
  } = useCompanyContext();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragOver = (event) => {
    const { over } = event;

    if (over) {
      setActiveGroup(over.id);
    } else {
      setActiveGroup(null);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setActiveGroup(null);
    setActiveCompany(null);

    if (!over) return;

    if (active.id.startsWith("group-") && over.id.startsWith("group-")) {
      const oldIndex = groups.findIndex((item) => item.id === active.id);
      const newIndex = groups.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newArray = arrayMove(groups, oldIndex, newIndex);
        setGroups(newArray);
      }
    } else {
      const oldIndex = savedCompanies.findIndex(
        (item) => item.id === active.id
      );
      const newIndex = savedCompanies.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newArray = arrayMove(savedCompanies, oldIndex, newIndex);
        setSavedCompanies(newArray);
      }
    }
    if (!active.id.startsWith("group-") && over.id.startsWith("group-")) {
      addCompanyToGroup(active.id, over.id);
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
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          collisionDetection={closestCenter}
          sensors={sensors}
        >
          <SortableContext items={savedCompanies}>
            <div className="saved-companies">
              <h3>Saved companies</h3>
              {savedCompanies.length > 0 ? (
                savedCompanies.map((company) => (
                  <Draggable id={company.entry_id} key={company.entry_id}>
                    <Sortable id={company.entry_id} key={company.entry_id}>
                      <div className="saved-company-container">
                        <span>{company.organisation_name}</span>
                      </div>
                    </Sortable>
                  </Draggable>
                ))
              ) : (
                <span className="saved-companies-empty">
                  No companies saved yet
                </span>
              )}
            </div>
          </SortableContext>
          <SortableContext items={groups}>
            <div className="groups-container">
              {groups.map((group) => (
                <Droppable id={group.id} key={group.id}>
                  <Sortable id={group.id} key={group.id}>
                    <div
                      className="group-wrapper"
                      style={{
                        backgroundColor:
                          activeGroup === group.id
                            ? "rgba(0, 220, 130, 0.1)"
                            : "transparent",
                      }}
                    >
                      <div className="group-wrapper-top-section">
                        <h3>{group.name}</h3>

                        <button
                          onClick={() => handleExtendGroup(group.id)}
                          className="group-extend-button"
                        >
                          <FontAwesomeIcon
                            icon={group.isExtended ? faAngleUp : faAngleDown}
                            className="group-arrow-down"
                          />
                        </button>
                      </div>

                      {group.isExtended && (
                        <ul>
                          {group.companies.map((company) => (
                            <li key={company.id}>
                              {company.groupedCompanyName}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </Sortable>
                </Droppable>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
