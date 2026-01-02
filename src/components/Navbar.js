import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/">
          <span className="logo-calligraphy">Aarya</span>
          <span className="logo-serif"> Estates</span>
        </Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home / Search</Link></li>
        <li><Link to="/favorites">My Saved Homes</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;