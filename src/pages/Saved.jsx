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
import {
  faAngleDown,
  faAngleUp,
  faTrashCan,
  faSquareMinus,
} from "@fortawesome/free-solid-svg-icons";

export default function Saved() {
  const [isGroup, setIsGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [draggedCompany, setDraggedCompany] = useState(null);

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

  const deleteGroup = (groupId) => {
    setGroups((prevState) => prevState.filter((group) => group.id !== groupId));
  };

  const deleteCompany = (companyId) => {
    setSavedCompanies((prevState) =>
      prevState.filter((company) => company.entry_id !== companyId)
    );
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

  const handleDragStart = (event) => {
    const { active } = event;

    if (!active.id.startsWith("group-")) {
      const company = savedCompanies.find(
        (company) => company.entry_id === active.id
      );
      setDraggedCompany(company);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setDraggedCompany(null);

    if (!over) return;

    if (active.id.startsWith("group-") && over.id.startsWith("group-")) {
      const oldIndex = groups.findIndex((item) => item.id === active.id);
      const newIndex = groups.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newArray = arrayMove(groups, oldIndex, newIndex);
        setGroups(newArray);
      }
    } else if (
      !active.id.startsWith("group-") &&
      over.id.startsWith("group-")
    ) {
      addCompanyToGroup(
        savedCompanies.find(
          (savedCompany) => savedCompany.entry_id === active.id
        ),
        over.id
      );
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
          <h2>Name group</h2>
          <input
            type="text"
            value={groupName}
            onChange={(event) => setGroupName(event.target.value)}
          />
          <button onClick={handleCreateGroup}>Create group</button>
        </div>
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          collisionDetection={closestCenter}
          sensors={sensors}
        >
          <div className="saved-companies">
            <h2>Saved companies</h2>
            {savedCompanies.length > 0 ? (
              savedCompanies.map((company) => (
                <Draggable id={company.entry_id} key={company.entry_id}>
                  <div className="saved-company-container">
                    <span>{company.organisation_name}</span>
                    <FontAwesomeIcon
                      className="saved-company-delete"
                      icon={faSquareMinus}
                      onClick={() => deleteCompany(company.entry_id)}
                    />
                  </div>
                </Draggable>
              ))
            ) : (
              <span className="saved-companies-empty">
                No companies saved yet
              </span>
            )}
          </div>

          <SortableContext items={groups}>
            <div className="groups-container">
              {groups.map((group) => (
                <Droppable id={group.id} key={group.id}>
                  <Sortable id={group.id}>
                    <div className="group-wrapper">
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
                              <li key={comp.entry_id}>
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
