import React, { useState } from 'react';
import { DropdownList, NumberPicker } from 'react-widgets';
import propertiesData from '../properties.json';
import "react-widgets/styles.css"; 
import { Link } from 'react-router-dom';
import '../index.css';

function SearchPage() {
  // 1. State for Filters
  const [criteria, setCriteria] = useState({
    type: "Any",
    minPrice: 0,
    maxPrice: 2000000,
    minBedrooms: 0,
    maxBedrooms: 10
  });

  // 2. State for Favorites (Synchronized with LocalStorage)
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem('favs')) || []
  );

  // 3. Toggle Favorite Logic
  const toggleFavorite = (prop) => {
    const isAlreadyFav = favorites.some(item => item.id === prop.id);
    let updatedFavorites;

    if (isAlreadyFav) {
      updatedFavorites = favorites.filter(item => item.id !== prop.id);
    } else {
      updatedFavorites = [...favorites, prop];
    }

    localStorage.setItem('favs', JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  // 4. Filter logic 
  const filteredProperties = propertiesData.properties.filter(prop => {
    const matchesType = criteria.type === "Any" || prop.type === criteria.type;
    const matchesPrice = prop.price >= criteria.minPrice && prop.price <= criteria.maxPrice;
    const matchesBeds = prop.bedrooms >= criteria.minBedrooms && prop.bedrooms <= criteria.maxBedrooms;
    return matchesType && matchesPrice && matchesBeds;
  });

  return (
    <div className="search-container">
      <section className="search-box">
        <h2>Search Properties</h2>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <div>
            <label>Type</label>
            <DropdownList
              data={["Any", "House", "Flat"]}
              value={criteria.type}
              onChange={val => setCriteria({...criteria, type: val})}
            />
          </div>

          <div>
            <label>Min Price</label>
            <NumberPicker 
              value={criteria.minPrice}
              onChange={val => setCriteria({...criteria, minPrice: val})}
            />
          </div>

          <div>
            <label>Min Bedrooms</label>
            <NumberPicker 
              value={criteria.minBedrooms}
              onChange={val => setCriteria({...criteria, minBedrooms: val})}
            />
          </div>
        </div>
      </section>

      <section className="results-grid">
        {filteredProperties.map(prop => {
          const isFav = favorites.some(fav => fav.id === prop.id);
          
          return (
            <div key={prop.id} className="property-card">
              <img src={prop.picture} alt={prop.type} />
              <div className="card-content">
                <h3>£{prop.price.toLocaleString()}</h3>
                <p>{prop.location}</p>
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <Link to={`/property/${prop.id}`} style={{ flex: 1 }}>
                    <button className="view-details-btn">View Details</button>
                  </Link>
                  
                  <button 
                    onClick={() => toggleFavorite(prop)}
                    className={`fav-btn ${isFav ? 'active' : ''}`}
                    title={isFav ? "Remove from Saved" : "Save Property"}
                  >
                    {isFav ? '❤️' : '🤍'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default SearchPage;