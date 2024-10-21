import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const btnRef = useRef();

  useEffect(() => {
    function closeNavbar(e) {
      if (e.target !== btnRef.current) {
        setIsOpen(false);
      }
    }

    document.body.addEventListener("click", closeNavbar);

    return () => {
      document.body.removeEventListener("click", closeNavbar);
    };
  }, []);

  return (
    <div className="navbar-container">
      <button
        onClick={() => {
          setIsOpen((prevState) => !prevState);
        }}
        className="navbar-button"
        ref={btnRef}
      >
        Menu
      </button>
      {isOpen ? (
        <div className="navbar-background">
          <ul className="navbar-content">
            <NavLink to="" className="navbar-item">
              Home
            </NavLink>
            <NavLink to="/search" className="navbar-item">
              Search
            </NavLink>
            <NavLink to="/favorites" className="navbar-item">
              Favorites
            </NavLink>
            <NavLink to="/organizer" className="navbar-item">
              Organizer
            </NavLink>
            <NavLink to="/account" className="navbar-item">
              Account
            </NavLink>
          </ul>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
