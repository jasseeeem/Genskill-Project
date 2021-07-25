import React from 'react';
import { NavLink } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";
import '../custom.scss';

const Navbar = ({ user, handleSettings }) => {
    return (
        <>
          <nav className="navbar navbar-expand-sm bg-primary navbar-light">
            <div className="container-fluid">
              <NavLink to="/" className="navbar-brand">
                <b>Notes App</b>
              </NavLink>
              { user && <span ><FiSettings onClick={handleSettings} color="black" size="20" /></span>}
            </div>
          </nav>
        </>
      );
};

export default Navbar;