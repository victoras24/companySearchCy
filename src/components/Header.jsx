import Navbar from "./Navbar"
import { Link } from "react-router-dom"

export default function Header() {
    return (
        <div className="header-container" >
            <Navbar />
            <Link to="/" className="logo-text">
                <h3 className="logo-text"><span className="logo-text-white">company</span>Search</h3>
            </Link>
        </div>
    )
}