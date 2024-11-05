// src/components/LoginForm/LoginForm.jsx

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './LoginForm.css';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const errors = useSelector((store) => store.errors);

  const login = (event) => {
    event.preventDefault();
    if (username && password) {
      dispatch({
        type: 'LOGIN',
        payload: { username, password },
      });
    } else {
      dispatch({ type: 'LOGIN_INPUT_ERROR' });
    }
  };

  return (
    <form className="formPanel" onSubmit={login}>
      <h2 className="form-title">Login</h2>
      {errors.loginMessage && (
        <h3 className="alert" role="alert">
          {errors.loginMessage}
        </h3>
      )}
      <label htmlFor="username" className="input-label">
        Username:
        <input
          type="text"
          name="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
        />
      </label>
      <label htmlFor="password" className="input-label">
        Password:
        <input
          type="password"
          name="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
      </label>
      <button type="submit" className="login-button">
        Log In
      </button>
    </form>
  );
}

export default LoginForm;
