import React from "react";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand navbar-white bg-body">
      <div className="container-fluid">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" data-lte-toggle="sidebar" href="#" role="button">
              <i className="bi bi-list"></i>
            </a>
          </li>
          <li className="nav-item d-none d-md-block"><a href="#" className="nav-link">Home</a></li>
          <li className="nav-item d-none d-md-block"><a href="#" className="nav-link">Contact</a></li>
        </ul>
        <ul className="navbar-nav ms-auto">
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
