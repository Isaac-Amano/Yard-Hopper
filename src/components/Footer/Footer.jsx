import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

function Footer() {
  const styles = {
    footer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#008C94', // Teal color from your logo
      color: '#ffffff',
      padding: '10px 0',
      fontSize: '14px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
    },
    logo: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '5px',
    },
    socialIcons: {
      display: 'flex',
      gap: '15px',
      fontSize: '18px',
      margin: '10px 0',
    },
    socialIcon: {
      color: '#ffffff',
      transition: 'color 0.3s ease',
      cursor: 'pointer',
    },
    socialIconHover: {
      color: '#ffffff88', // Slightly transparent white on hover
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.logo}>&copy; Yard Hopper 2024</div>
      <div style={styles.socialIcons}>
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.socialIcon}
          onMouseEnter={(e) => (e.currentTarget.style.color = styles.socialIconHover.color)}
          onMouseLeave={(e) => (e.currentTarget.style.color = styles.socialIcon.color)}
        >
          <FaFacebook />
        </a>
        <a
          href="https://www.twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.socialIcon}
          onMouseEnter={(e) => (e.currentTarget.style.color = styles.socialIconHover.color)}
          onMouseLeave={(e) => (e.currentTarget.style.color = styles.socialIcon.color)}
        >
          <FaTwitter />
        </a>
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.socialIcon}
          onMouseEnter={(e) => (e.currentTarget.style.color = styles.socialIconHover.color)}
          onMouseLeave={(e) => (e.currentTarget.style.color = styles.socialIcon.color)}
        >
          <FaInstagram />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
