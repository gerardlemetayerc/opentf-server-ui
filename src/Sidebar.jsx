import React from "react";

export default function Sidebar() {
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
              <a href="#" className="nav-link">
                <i className="nav-icon bi bi-speedometer"></i>
                <p>Dashboard</p>
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon bi bi-plus-circle"></i>
                <p>Nouvelle instance</p>
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon bi bi-list-ul"></i>
                <p>Instances managées</p>
              </a>
            </li>
            <li className="nav-header mt-3">Admin</li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon bi bi-box-seam"></i>
                <p>Gestion des offres</p>
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon bi bi-database"></i>
                <p>Gestion des données</p>
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon bi bi-people"></i>
                <p>Gestion IAM</p>
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon bi bi-gear"></i>
                <p>Configuration</p>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
