import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import useSignUpWithEmailAndPassword from "../Hooks/useSignUpWithEmailAndPassword";
import useLogout from "../Hooks/useLogout";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const btnRef = useRef();

  const { currentUser } = useSignUpWithEmailAndPassword();
  const { handleLogOut } = useLogout();

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
          <div className="navbar-content">
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
            <div className="navbar-account">
              <NavLink to="/account" className="navbar-item">
                {currentUser ? currentUser.displayName : "Account"}
              </NavLink>
              <button onClick={handleLogOut}>L</button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
