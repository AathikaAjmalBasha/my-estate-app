import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../index.css'; // Using your global CSS

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState(() => {
        // This runs immediately on load
        const saved = localStorage.getItem('favs');
        return saved ? JSON.parse(saved) : [];
      });

  // Load favorites from localStorage when the page opens
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('favs')) || [];
    setFavorites(saved);
  }, []);

  // Function to remove a single house
  const removeFavorite = (id) => {
    const updated = favorites.filter(item => item.id !== id);
    setFavorites(updated);
    localStorage.setItem('favs', JSON.stringify(updated));
  };

  // Function to clear everything
  const clearAll = () => {
    if (window.confirm("Are you sure you want to remove all saved homes?")) {
      localStorage.removeItem('favs');
      setFavorites([]);
    }
  };

  return (
    <div className="favorites-page-container">
      <div className="favorites-page-header">
        <h1>My Saved Homes</h1>
        {favorites.length > 0 && (
          <button onClick={clearAll} className="clear-btn">Clear All</button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="no-favorites-state">
          <p className="no-favorites-title">You haven't saved any properties yet.</p>
          <p className="no-favorites-subtitle">Start searching and save your favorite properties!</p>
          <Link to="/">
            <button className="view-details-btn go-search-btn">
              🔍 Go Search for Homes
            </button>
          </Link>
        </div>
      ) : (
        <div className="results-grid">
          {favorites.map(prop => (
            <div key={prop.id} className="property-card">
              <Link to={`/property/${prop.id}`} className="property-card-link">
                <img src={prop.picture} alt={prop.type} />
              </Link>
              <div className="card-content">
                <h3>£{prop.price.toLocaleString()}</h3>
                <p className="property-location">{prop.location}</p>
                {prop.description && <p className="property-description">{prop.description}</p>}
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <Link to={`/property/${prop.id}`} style={{ flex: 1 }}>
                    <button className="view-details-btn">View Details</button>
                  </Link>
                  
                  <button 
                    onClick={() => removeFavorite(prop.id)}
                    className="remove-btn"
                    title="Remove"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;