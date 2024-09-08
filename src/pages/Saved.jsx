import { useState } from "react";
import { useCompanyContext } from "../context/SavedCompanyContext";

export default function Saved() {
  const [isGroup, setIsGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const { groups, createGroup, savedCompanies } = useCompanyContext();

  const handleCreateGroup = () => {
    if (groupName.trim()) {
      createGroup(groupName);
      setGroupName("");
    }
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
          {savedCompanies.map((company, index) => {
            return (
              <div className="saved-company-container" key={index}>
                <h3>{company.organisation_name}</h3>
              </div>
            );
          })}
        </div>
        <div className="groups-container">
          {groups.map((group, index) => {
            return (
              <div className="group-wrapper" key={index}>
                <h3>{group.name}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
