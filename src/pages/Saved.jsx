import { useState } from "react"

export default function Saved() {
    // when clicking the button, display a div to name the group name
    const [isGroup, setIsGroup] = useState(false)
    const [groupName, setGroupName] = useState("")
    const [groups, setGroups] = useState([])



    return (
        <div className="saved-page">
            <h1 className="saved-title">Saved companies</h1>
            <p className="saved-description">Find and organise easily Cyprus companies that you have saved.</p>
            <button className="group-add-button" onClick={() => setIsGroup(prevState => !prevState)}>
                {isGroup ? "x Close" : "+ Add"}
            </button>
            <div className="saved-groups">
                <div
                    className="create-group-container"
                    style={isGroup ? { display: "flex" } : { display: "none" }}
                >
                    <h3>Name group</h3>
                    <input type="text" onChange={(event) => event.target.value} />
                    <button >
                        Create group
                    </button>
                </div>
                <div className="groups-container">
                    {
                        groups.map(group => {
                            return (
                                <h3>
                                    {group.name}
                                </h3>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}