import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const MyListings = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userListings = useSelector((state) => state.userListings);
  const [message, setMessage] = useState('');

  useEffect(() => {
    dispatch({ type: 'FETCH_USER_LISTINGS' });
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      dispatch({ type: 'DELETE_LISTING', payload: id });
      setMessage('Listing deleted successfully!');
      
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  const handleEdit = (id) => {
    history.push(`/edit/${id}`);
  };

  const styles = {
    container: {
      padding: '20px',
      backgroundColor: '#f9f9f9',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    headerCard: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      backgroundColor: '#f1f1f1',
      margin: '20px auto',
      width: '80%',
      borderRadius: '12px',
      fontSize: '24px',
      fontWeight: 'bold',
      textAlign: 'center',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '20px',
      width: '100%',
      maxWidth: '1200px',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer',
    },
    cardHover: {
      transform: 'translateY(-8px)',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
    },
    imageContainer: {
      backgroundColor: '#e0e0e0',
      height: '150px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    cardContent: {
      padding: '15px',
      textAlign: 'left',
    },
    title: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '5px',
    },
    description: {
      fontSize: '14px',
      color: '#555',
      marginBottom: '10px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxHeight: '3em',
      lineHeight: '1.5em',
    },
    location: {
      fontSize: '14px',
      color: '#888',
      marginBottom: '10px',
    },
    actions: {
      display: 'flex',
      justifyContent: 'space-around',
      padding: '10px',
      borderTop: '1px solid #ddd',
      backgroundColor: '#f9f9f9',
    },
    button: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '6px',
      fontWeight: 'bold',
      fontSize: '14px',
      color: 'white',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease, transform 0.2s ease',
    },
    editButton: {
      backgroundColor: '#4caf50',
    },
    deleteButton: {
      backgroundColor: 'darkgrey',
    },
    buttonHover: {
      transform: 'scale(1.05)',
    },
    backButton: {
      backgroundColor: '#17a2b8',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '6px',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginBottom: '20px',
      transition: 'background-color 0.3s ease',
    },
    messageBox: {
      backgroundColor: '#d4edda',
      color: '#155724',
      padding: '10px',
      border: '1px solid #c3e6cb',
      borderRadius: '4px',
      marginBottom: '20px',
      fontSize: '14px',
      textAlign: 'center',
    }
  };

  return (
    <div style={styles.container}>
      <button
        onClick={() => history.push('/listings')}
        style={styles.backButton}
      >
        &larr; Back to Listings
      </button>

      <div style={styles.headerCard}>My Listings</div>
      
      {message && <div style={styles.messageBox}>{message}</div>}

      <div style={styles.grid}>
        {userListings && userListings.length > 0 ? (
          userListings.map((listing) => (
            <div
              key={listing.id}
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = styles.cardHover.transform;
                e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <div style={styles.imageContainer}>
                <img src={listing.image_url_1} alt={listing.title} style={styles.image} />
              </div>
              <div style={styles.cardContent}>
                <h3 style={styles.title}>{listing.title}</h3>
                <p style={styles.description}>{listing.description}</p>
                <p style={styles.location}>{listing.city}, {listing.state}</p>
              </div>
              <div style={styles.actions}>
                <button
                  onClick={() => handleEdit(listing.id)}
                  style={{ ...styles.button, ...styles.editButton }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = styles.buttonHover.transform)}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = '')}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(listing.id)}
                  style={{ ...styles.button, ...styles.deleteButton }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = styles.buttonHover.transform)}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = '')}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No listings available</p>
        )}
      </div>
    </div>
  );
};

export default MyListings;
