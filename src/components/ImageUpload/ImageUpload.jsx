import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle form submission (image upload)
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!selectedFile) {
      console.error('No file selected');
      return;
    }
  
    const formData = new FormData();
    formData.append('image', selectedFile);
  
    try {
      console.log('Uploading image...');
      const response = await axios.post('/api/image/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response from server:', response.data);
  
      setImageUrl(response.data.url || response.data.imageUrl);  // Ensure this matches server response
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  
  return (
    <div>
      <h2>Upload an Image</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>

      {/* Display the uploaded image */}
      {imageUrl && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={imageUrl} alt="Uploaded" style={{ width: '300px' }} />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
