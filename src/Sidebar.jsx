import React from "react";
import { FaThLarge } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useUser } from "./Auth";

export default function Sidebar() {
  const { user, token } = useUser?.() || {};
  const hasToken = token || localStorage.getItem("auth_token");
  if (!user && !hasToken) return null;

  return (
    <aside className="app-sidebar bg-body-secondary shadow" data-bs-theme="dark">
      <div className="sidebar-brand">
        <a href="#" className="brand-link">
          <span className="text-center brand-text fw-light">Cloud Management <br/>Platform</span>
        </a>
      </div>
      <div className="sidebar-wrapper">
        <nav className="mt-2">
          <ul className="nav sidebar-menu flex-column" data-lte-toggle="treeview" role="navigation" aria-label="Main navigation" data-accordion="false" id="navigation">
            <li className="nav-item">
              <NavLink to="/" end className={({ isActive }) => "nav-link" + (isActive ? " active" : "") }>
                <i className="nav-icon bi bi-speedometer"></i>
                <p>Dashboard</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/servicecatalog" className={({ isActive }) => "nav-link" + (isActive ? " active" : "") }>
                <span className="nav-icon" style={{ display: 'inline-flex', alignItems: 'center' }}><FaThLarge size={18} /></span>
                <p>Catalogue de service</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/instances" className={({ isActive }) => "nav-link" + (isActive ? " active" : "") }>
                <i className="nav-icon bi bi-list-ul"></i>
                <p>Instances managées</p>
              </NavLink>
            </li>
            <li className="nav-header mt-3">Admin</li>
            <li className="nav-item">
              <NavLink to="/offres" className={({ isActive }) => "nav-link" + (isActive ? " active" : "") }>
                <i className="nav-icon bi bi-magic"></i>
                <p>Gestion du catalogue</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/domaines-admin" className={({ isActive }) => "nav-link" + (isActive ? " active" : "") }>
                <i className="nav-icon bi bi-database"></i>
                <p>Domaines & valeurs suggérées</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/iam" className={({ isActive }) => "nav-link" + (isActive ? " active" : "") }>
                <i className="nav-icon bi bi-people"></i>
                <p>Gestion IAM</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/configuration" className={({ isActive }) => "nav-link" + (isActive ? " active" : "") }>
                <i className="nav-icon bi bi-gear"></i>
                <p>Configuration</p>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
