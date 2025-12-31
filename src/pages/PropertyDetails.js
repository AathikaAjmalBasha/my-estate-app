import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import propertiesData from '../properties.json';

const PropertyDetails = () => {
  const { id } = useParams();
  
  // 1. Find the property
  const property = propertiesData.properties.find(p => p.id === id);

  // 2. Set the main image state (Careful: only if property exists!)
  const [mainImage, setMainImage] = useState(property ? property.picture : '');

  // 3. SAFETY CHECK: If property is not found, show a message instead of crashing
  if (!property) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Property Not Found</h2>
        <p>We couldn't find a house with ID: {id}</p>
        <a href="/">Back to Search</a>
      </div>
    );
  }

  return (
    <div className="details-container">
      <div className="gallery-section">
        <img src={mainImage} alt="Main" className="main-img" />
        
        <div className="thumbnails">
          {/* 4. OPTIONAL CHAINING: Adding the '?' prevents the .map error */}
          {property.images?.map((img, index) => (
            <img 
              key={index} 
              src={img} 
              alt={`thumbnail-${index}`} 
              onClick={() => setMainImage(img)} 
            />
          ))}
        </div>
      </div>

      <div className="info-section">
        <h1>£{property.price.toLocaleString()}</h1>
        <h3>{property.type} in {property.location}</h3>
        {/* ... rest of your code ... */}
      </div>
    </div>
  );
};
export default PropertyDetails;