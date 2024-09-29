import React, { useState, useEffect } from 'react';
import { FaBars, FaSignOutAlt } from 'react-icons/fa'; // For hamburger and logout icon
import './nav.css'; // Separate CSS file for styling
import { useNavigate } from 'react-router-dom'; // To navigate after logout

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('username'); 

    const rememberMe = localStorage.getItem('rememberedUsername') && localStorage.getItem('rememberedPassword');
    if (!rememberMe) {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
    }

    closeSidebar(); 
    navigate('/', { replace: true });
  };
  
  const home = () => {
    closeSidebar(); 
    navigate('/mobiledasboard'); 
  };

 
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeSidebar();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div>
      <div className="top-navbar">
        <button
          className="menu-btn"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <FaBars />
        </button>
        <h2 className="nav-name">SMART TICKET</h2>
      </div>

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <ul>
          {username && (
            <li className="user-info">เจ้าหน้าที่จราจร : {username}</li> // Display username
          )}
          <li onClick={home}>รายการใบสั่ง</li>
          <li className="logout" onClick={handleLogout}>
            <FaSignOutAlt /> ออกจากระบบ
          </li>
        </ul>
      </div>

      {/* Overlay when sidebar is open */}
      {isOpen && <div className="overlay" onClick={closeSidebar}></div>}
    </div>
  );
};

export default Navbar;
