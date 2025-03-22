import { useState } from "react";
import { useCompanyContext } from "../context/SavedCompanyContext";
import { Reorder } from "framer-motion";
import { Icon } from "../components/Icon";
import {
  faSquareMinus,
  faAngleDown,
  faAngleUp,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

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
              (company) => company.id !== companyId
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

    setGroups((prevGroups) => {
      return prevGroups.map((prevGroup) => {
        if (prevGroup.id === targetGroupId) {
          const companyExistsInTargetGroup = prevGroup.companies.some(
            (company) => company.id === draggedCompany.id
          );

          if (!companyExistsInTargetGroup) {
            return {
              ...prevGroup,
              companies: [...prevGroup.companies, draggedCompany], // Add the company if it doesn't exist
            };
          }
        }

        if (prevGroup.id === sourceGroupId) {
          const companyExistsInTargetGroup = prevGroups
            .find((group) => group.id === targetGroupId)
            .companies.some((company) => company.id === draggedCompany.id);

          if (!companyExistsInTargetGroup) {
            return {
              ...prevGroup,
              companies: prevGroup.companies.filter(
                (company) => company.id !== draggedCompany.id
              ),
            };
          }
        }

        return prevGroup;
      });
    });
  };

  return (
    <div className="organizer-page">
      <h1 className="saved-title">Company organizer</h1>
      <p className="saved-description">
        Create and manage groups to efficiently organize your saved companies.
        Categorize your favorites for easy access and streamlined management.
      </p>
      <motion.button
        className="group-add-button"
        onClick={() => setIsGroup((prevState) => !prevState)}
        whileTap={{ scale: 0.9 }}
      >
        {isGroup ? "x Close" : "+ Add"}
      </motion.button>
      <AnimatePresence>
        {isGroup && (
          <motion.div
            className="create-group-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <h2>Name group</h2>
            <input
              className="create-group-input"
              type="text"
              value={groupName}
              onChange={(event) => setGroupName(event.target.value)}
            />
            <button onClick={handleCreateGroup}>Create group</button>
          </motion.div>
        )}
      </AnimatePresence>
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
                      <Icon
                        symbol={group.isExtended ? faAngleUp : faAngleDown}
                        style="group-arrow-down"
                      />
                    </button>
                    <button
                      className="group-delete-button"
                      onClick={() => deleteGroup(group.id)}
                    >
                      <Icon symbol={faTrashCan} style="group-trash-can" />
                    </button>
                  </div>
                </div>
                {group.isExtended && (
                  <ul>
                    {group.companies.map((comp) => (
                      <div className="grouped-companies" key={comp.id}>
                        <li
                          draggable
                          onDragStart={(event) =>
                            hanldeDragStart(event, comp, group.id)
                          }
                        >
                          {comp.name}
                        </li>
                        <Icon
                          symbol={faSquareMinus}
                          style="saved-company-delete"
                          onClick={() =>
                            deleteGroupedCompany(group.id, comp.id)
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
