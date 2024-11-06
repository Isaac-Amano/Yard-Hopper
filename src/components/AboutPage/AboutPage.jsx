import React from 'react';

// This is one of our simplest components
// It doesn't have local state,
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is'


  function AboutPage() {
    return (
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
        <h2>About Yard Hopper</h2>
        <p><strong>Created by Isaac Amano</strong></p>
        <p>
          Yard Hopper is a platform designed to make local garage sales easier to discover and participate in.
          Whether you’re a buyer looking for nearby sales or a seller wanting to advertise your items, Yard Hopper
          offers a simple interface to post, search, and explore listings. With integrated location features and 
          contact options, Yard Hopper is your go-to tool for garage sales in your community.
        </p>
      </div>
  );
}

export default AboutPage;
