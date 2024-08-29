import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';


export default function Home() {
    return (
        <div className="home-container">
            <h1 className="home-title">Save time <span className="home-title-highlight">searching</span> for Cyprus companies</h1>
            <p className="home-paragraph">Save hours of time for you and your team when searching for UK company information so you can focus on what matters most.</p>
            <NavLink to="search">
                <button className='home-search-button'><FontAwesomeIcon icon={faSearch} className="home-search-button-icon" />Search</button>
            </NavLink>
        </div>
    )
}