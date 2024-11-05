// src/components/LoginPage/LoginPage.jsx

import React from 'react';
import LoginForm from '../LoginForm/LoginForm';
import { useHistory } from 'react-router-dom';
import logo from '../LogoImage/Yard Hopper.png';
import './LoginPage.css';

function LoginPage() {
  const history = useHistory();

  return (
    <div className="login-container">
      {/* Logo Display */}
      <img src={logo} alt="Yard Hopper Logo" className="logo" />

      <div className="login-card">
        <LoginForm />

        <button
          type="button"
          className="register-button"
          onClick={() => {
            history.push('/registration');
          }}
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
