import React from "react";
import { useUser } from "./Auth";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useUser?.() || {};
  const navigate = useNavigate();
  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand navbar-white bg-body">
      <div className="container-fluid">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" data-lte-toggle="sidebar" href="#" role="button">
              <i className="bi bi-list"></i>
            </a>
          </li>
          <li className="nav-item d-none d-md-block"><a href="#" className="nav-link">Aide</a></li>
        </ul>
        <ul className="navbar-nav ms-auto">
          {/* Dropdown utilisateur à droite */}
          {user && (
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="bi bi-person-circle me-1"></i> {user.email}
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li><span className="dropdown-item-text">{user.first_name} {user.last_name}</span></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" onClick={handleLogout}>Se déconnecter</button></li>
              </ul>
            </li>
          )}
          <li className="nav-item">
            <a className="nav-link" data-widget="navbar-search" href="#" role="button">
              <i className="bi bi-search"></i>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
