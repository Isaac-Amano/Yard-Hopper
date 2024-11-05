import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();

  const registerUser = (event) => {
    event.preventDefault();

    dispatch({
      type: 'REGISTER',
      payload: {
        username: username,
        password: password,
      },
    });
  };

  const styles = {
    formPanel: {
      backgroundColor: '#ffffff',
      padding: '40px',
      borderRadius: '12px',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
      maxWidth: '400px',
      width: '100%',
      margin: '0 auto',
      textAlign: 'center',
      fontFamily: "'Poppins', sans-serif",
    },
    heading: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#333',
      marginBottom: '20px',
    },
    alert: {
      fontSize: '16px',
      color: '#d9534f',
      marginBottom: '15px',
      fontWeight: '600',
    },
    inputGroup: {
      marginBottom: '20px',
      textAlign: 'left',
    },
    label: {
      display: 'block',
      fontSize: '16px',
      fontWeight: '500',
      color: '#333',
      marginBottom: '8px',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '16px',
      backgroundColor: '#f7f9fc',
      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    },
    inputFocus: {
      borderColor: '#00acb0',
      boxShadow: '0 0 8px rgba(0, 172, 176, 0.3)',
      outline: 'none',
    },
    submitButton: {
      width: '100%',
      padding: '14px 0',
      marginTop: '20px',
      backgroundColor: '#00acb0',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '17px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
    },
    submitButtonHover: {
      backgroundColor: '#00757b',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 15px rgba(0, 115, 123, 0.2)',
    },
    submitButtonActive: {
      backgroundColor: '#005b63',
      transform: 'translateY(1px)',
      boxShadow: '0 4px 8px rgba(0, 91, 99, 0.3)',
    },
  };

  return (
    <form style={styles.formPanel} onSubmit={registerUser}>
      <h2 style={styles.heading}>Register User</h2>
      {errors.registrationMessage && (
        <h3 style={styles.alert} role="alert">
          {errors.registrationMessage}
        </h3>
      )}

      <div style={styles.inputGroup}>
        <label htmlFor="username" style={styles.label}>
          Username:
        </label>
        <input
          type="text"
          name="username"
          value={username}
          required
          onChange={(event) => setUsername(event.target.value)}
          style={styles.input}
          onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
          onBlur={(e) => Object.assign(e.target.style, styles.input)}
        />
      </div>

      <div style={styles.inputGroup}>
        <label htmlFor="password" style={styles.label}>
          Password:
        </label>
        <input
          type="password"
          name="password"
          value={password}
          required
          onChange={(event) => setPassword(event.target.value)}
          style={styles.input}
          onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
          onBlur={(e) => Object.assign(e.target.style, styles.input)}
        />
      </div>

      <input
        type="submit"
        name="submit"
        value="Register"
        style={styles.submitButton}
        onMouseEnter={(e) => Object.assign(e.target.style, styles.submitButtonHover)}
        onMouseLeave={(e) => Object.assign(e.target.style, styles.submitButton)}
        onMouseDown={(e) => Object.assign(e.target.style, styles.submitButtonActive)}
        onMouseUp={(e) => Object.assign(e.target.style, styles.submitButtonHover)}
      />
    </form>
  );
}

export default RegisterForm;
