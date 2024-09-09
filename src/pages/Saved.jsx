import { useState } from "react";
import { useCompanyContext } from "../context/SavedCompanyContext";
import { Reorder } from "framer-motion";

export default function Saved() {
  const [isGroup, setIsGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const { groups, setGroups, createGroup, savedCompanies, setSavedCompanies } =
    useCompanyContext();

  const handleCreateGroup = () => {
    if (groupName.trim()) {
      createGroup(groupName);
      setGroupName("");
    }
  };

  const addCompanyToGroup = () => {};

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

        <div className="saved-companies">
          <Reorder.Group values={savedCompanies} onReorder={setSavedCompanies}>
            {savedCompanies.map((company) => (
              <Reorder.Item value={company} key={company.entry_id}>
                <div className="saved-company-container">
                  <h3>{company.organisation_name}</h3>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>

        <div className="groups-container">
          <Reorder.Group values={groups} onReorder={setGroups}>
            {groups.map((group, groupIndex) => (
              <Reorder.Item value={group} key={group.id}>
                <div className="group-wrapper" key={groupIndex}>
                  <h3>{group.name}</h3>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      </div>
    </div>
  );
}
