import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/global.css';

const Navbar = () => {
  const { isAuthenticated, isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            <h2>PhishLock</h2>
          </Link>
        </div>
        <ul className="nav-menu" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to={isAdmin ? "/admin" : "/dashboard"} className="nav-link">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link" style={{ padding: '8px 16px', background: '#dc2626', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 'bold', color: 'white' }}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link" style={{ fontWeight: 'bold' }}>Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/signup" className="nav-link" style={{ padding: '8px 16px', background: '#2563eb', borderRadius: '4px', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;