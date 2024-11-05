import React from 'react';
import { Link } from 'react-router-dom';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import { useSelector } from 'react-redux';

function Nav() {
  const user = useSelector((store) => store.user);

  return (
    <div className="nav">
      <Link to="/listings">
        <h2 className="nav-title">  Yard Hopper</h2>
      </Link>
      <div>
        {/* If no user is logged in, show login/registration links */}
        {!user.id && (
          <Link className="navLink" to="/login">
            Login / Register
          </Link>
        )}

        {/* If a user is logged in, show the main navigation links */}
        {user.id && (
          <>
            <Link className="navLink" to="/listings">
              Listings
            </Link>

            <Link className="navLink" to="/addlisting">
              Post a Listing
            </Link>

            <Link className="navLink" to="/mylistings">
              My Listings
            </Link>

            <Link className="navLink" to="/about">
              About
            </Link>

            <LogOutButton className="navLink" />
          </>
        )}
      </div>
    </div>
  );
}

export default Nav;
