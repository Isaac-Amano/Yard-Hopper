// src/components/RegisterPage/RegisterPage.jsx

import React from 'react';
import { useHistory } from 'react-router-dom';
import RegisterForm from '../RegisterForm/RegisterForm';
import './RegisterPage.css';

function RegisterPage() {
  const history = useHistory();

  const loginButtonStyle = {
    fontSize: '15px',
    color: '#00acb0',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontWeight: '600',
    transition: 'color 0.3s ease',
  };

  const loginButtonHoverStyle = {
    color: '#00757b', // Darker teal on hover
  };

  return (
    <div className="register-container">
      <RegisterForm />

      <center>
        <button
          type="button"
          style={loginButtonStyle}
          onClick={() => {
            history.push('/login');
          }}
          onMouseEnter={(e) => Object.assign(e.target.style, loginButtonHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.target.style, loginButtonStyle)}
        >
          Login
        </button>
      </center>
    </div>
  );
}

export default RegisterPage;
