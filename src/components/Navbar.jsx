import { useState } from "react"

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="navbar-container">
            <button onClick={() => { setIsOpen(prevState => !prevState) }} className="navbar-button">
                Menu
            </button>
            {isOpen ?
                <div className="navbar-background">
                    <ul className="navbar-content">
                        <li>
                            Search
                        </li>
                        <li>
                            Saved
                        </li>
                        <li>
                            History
                        </li>
                        <li>
                            Settings
                        </li>
                    </ul>
                </div>
                : ""

            }
        </div>
    )
}