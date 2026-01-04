import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import propertiesData from '../properties.json';
import '../index.css';

// HTML encoding function for security
const escapeHtml = (text) => {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
};

const PropertyDetails = () => {
  const { id } = useParams();
  
  // Find the property
  const property = propertiesData.properties.find(p => p.id === id);

  // Combine main picture with images array, ensuring main picture is first
  // Use process.env.PUBLIC_URL for GitHub Pages compatibility
  const getImagePath = (img) => {
    if (!img) return '';
    const publicUrl = process.env.PUBLIC_URL || '';
    if (img.startsWith('/')) {
      return `${publicUrl}${img}`;
    }
    return `${publicUrl}/${img}`;
  };
  
  const propertyImages = property 
    ? [property.picture, ...(property.images || [])]
        .filter(Boolean)
        .map(getImagePath)
    : [];

  // State management
  const [mainImage, setMainImage] = useState(
    property ? getImagePath(property.picture || property.images?.[0] || '') : ''
  );
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem('favs')) || []
  );
  const [draggedProperty, setDraggedProperty] = useState(null);
  const [dragFromFavorites, setDragFromFavorites] = useState(false);

  // Update main image when property changes
  useEffect(() => {
    if (property && propertyImages.length > 0) {
      // Use the first image from the combined array (main picture)
      setMainImage(propertyImages[0]);
    }
  }, [property]);

  // Check if property is in favorites
  const isFavorite = favorites.some(fav => fav.id === property?.id);

  // Toggle favorite
  const toggleFavorite = () => {
    if (!property) return;
    
    let updatedFavorites;
    if (isFavorite) {
      updatedFavorites = favorites.filter(item => item.id !== property.id);
    } else {
      // Ensure property is only added once
      if (!favorites.some(fav => fav.id === property.id)) {
        updatedFavorites = [...favorites, property];
      } else {
        updatedFavorites = favorites;
      }
    }
    
    setFavorites(updatedFavorites);
    localStorage.setItem('favs', JSON.stringify(updatedFavorites));
  };

  // Handle drag start
  const handleDragStart = (e, prop, fromFavorites = false) => {
    setDraggedProperty(prop);
    setDragFromFavorites(fromFavorites);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', prop.id);
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drop to favorites
  const handleDropToFavorites = (e) => {
    e.preventDefault();
    if (draggedProperty) {
      // Only add if not already in favorites (if dragging from outside)
      if (!dragFromFavorites && !favorites.some(fav => fav.id === draggedProperty.id)) {
        const updatedFavorites = [...favorites, draggedProperty];
        setFavorites(updatedFavorites);
        localStorage.setItem('favs', JSON.stringify(updatedFavorites));
      }
    }
    setDraggedProperty(null);
    setDragFromFavorites(false);
  };

  // Handle drop outside favorites (remove from favorites)
  const handleDropOutside = (e) => {
    e.preventDefault();
    if (draggedProperty && dragFromFavorites) {
      // Remove from favorites
      const updatedFavorites = favorites.filter(item => item.id !== draggedProperty.id);
      setFavorites(updatedFavorites);
      localStorage.setItem('favs', JSON.stringify(updatedFavorites));
    }
    setDraggedProperty(null);
    setDragFromFavorites(false);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedProperty(null);
    setDragFromFavorites(false);
  };

  // Remove from favorites
  const removeFavorite = (propId) => {
    const updatedFavorites = favorites.filter(item => item.id !== propId);
    setFavorites(updatedFavorites);
    localStorage.setItem('favs', JSON.stringify(updatedFavorites));
  };

  // Clear all favorites
  const clearFavorites = () => {
    if (window.confirm('Are you sure you want to clear all favorites?')) {
      setFavorites([]);
      localStorage.removeItem('favs');
    }
  };

  // Open lightbox
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Close lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  // Navigate lightbox
  const navigateLightbox = (direction) => {
    if (!propertyImages.length) return;
    const totalImages = propertyImages.length;
    if (direction === 'next') {
      setLightboxIndex((prev) => (prev + 1) % totalImages);
    } else {
      setLightboxIndex((prev) => (prev - 1 + totalImages) % totalImages);
    }
  };

  // Close lightbox on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && lightboxOpen) {
        closeLightbox();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [lightboxOpen]);

  // Safety check
  if (!property) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Property Not Found</h2>
        <p>We couldn't find a property with ID: {escapeHtml(id)}</p>
        <Link to="/">Back to Search</Link>
      </div>
    );
  }

  return (
    <div 
      className={`property-details-container ${dragFromFavorites ? 'dragging-from-favorites' : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDropOutside}
    >
      <div className="property-details-main">
        {/* Header with price and basic info */}
        <div className="property-header">
          <div>
            <h1>£{property.price.toLocaleString()}</h1>
            <h2>{escapeHtml(property.type)} in {escapeHtml(property.location)}</h2>
            <div className="property-meta">
              <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
              <span>•</span>
              <span>{escapeHtml(property.tenure)}</span>
            </div>
          </div>
          <button 
            onClick={toggleFavorite}
            className={`favorite-btn-large ${isFavorite ? 'active' : ''}`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? '❤️ Saved' : '🤍 Save'}
          </button>
        </div>

        {/* Image Gallery */}
        <div className="gallery-section">
          <div 
            className="main-image-container"
            onClick={() => openLightbox(0)}
            onDragStart={(e) => handleDragStart(e, property)}
            onDragEnd={handleDragEnd}
            draggable
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && openLightbox(0)}
            aria-label="Click to view full size image gallery"
          >
            <img 
              src={mainImage} 
              alt={`${escapeHtml(property.type)} in ${escapeHtml(property.location)}`} 
              className="main-img" 
            />
            <div className="image-overlay">
              <span>Click to view all {propertyImages.length} images</span>
            </div>
          </div>
          
          <div className="thumbnails">
            {propertyImages.map((img, index) => (
              <img 
                key={index}
                src={img} 
                alt={`${escapeHtml(property.type)} - Image ${index + 1}`}
                onClick={() => {
                  setMainImage(img);
                  openLightbox(index);
                }}
                className={mainImage === img ? 'active' : ''}
                onDragStart={(e) => handleDragStart(e, property)}
                onDragEnd={handleDragEnd}
                draggable
              />
            ))}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="tabs-section">
          <Tabs>
            <TabList>
              <Tab>Description</Tab>
              <Tab>Floor Plan</Tab>
              <Tab>Map</Tab>
            </TabList>

            <TabPanel>
              <div className="tab-content">
                <h3>Property Description</h3>
                <p className="long-description">
                  {escapeHtml(property.longDescription || property.description)}
                </p>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="tab-content">
                <h3>Floor Plan</h3>
                <div className="floor-plan-container">
                  <img 
                    src={getImagePath(property.floorPlan || property.picture || '')} 
                    alt={`Floor plan for ${escapeHtml(property.location)}`}
                    className="floor-plan-image"
                  />
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="tab-content">
                <h3>Location Map</h3>
                <div className="map-container">
                  <iframe
                    title={`Map showing ${escapeHtml(property.location)}`}
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(property.location)}&output=embed`}
                  ></iframe>
                  <div className="map-fallback">
                    <p>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View {escapeHtml(property.location)} on Google Maps
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </div>

      {/* Favorites Sidebar */}
      <aside 
        className={`favorites-sidebar ${draggedProperty && !dragFromFavorites ? 'drag-over' : ''}`}
        onDragOver={(e) => {
          if (!dragFromFavorites) {
            handleDragOver(e);
          }
        }}
        onDrop={handleDropToFavorites}
      >
        <div className="favorites-header">
          <h3>My Favorites</h3>
          {favorites.length > 0 && (
            <button 
              onClick={clearFavorites}
              className="clear-favorites-btn"
              aria-label="Clear all favorites"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="favorites-list">
          {favorites.length === 0 ? (
            <p className="no-favorites">Drag properties here or use the save button to add favorites</p>
          ) : (
            favorites.map((fav) => (
              <div 
                key={fav.id} 
                className={`favorite-item ${draggedProperty?.id === fav.id && dragFromFavorites ? 'dragging' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, fav, true)}
                onDragEnd={handleDragEnd}
              >
                <Link to={`/property/${fav.id}`} className="favorite-link">
                  <img src={getImagePath(fav.picture)} alt={escapeHtml(fav.location)} />
                  <div className="favorite-info">
                    <strong>£{fav.price.toLocaleString()}</strong>
                    <p>{escapeHtml(fav.location)}</p>
                  </div>
                </Link>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    removeFavorite(fav.id);
                  }}
                  className="remove-favorite-btn"
                  aria-label={`Remove ${escapeHtml(fav.location)} from favorites`}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Lightbox */}
      {lightboxOpen && propertyImages[lightboxIndex] && (
        <div className="lightbox" onClick={closeLightbox}>
          <button 
            className="lightbox-close"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            ×
          </button>
          <button 
            className="lightbox-nav lightbox-prev"
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox('prev');
            }}
            aria-label="Previous image"
          >
            ‹
          </button>
          <img 
            src={propertyImages[lightboxIndex]} 
            alt={`${escapeHtml(property.type)} - Image ${lightboxIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
          />
          <button 
            className="lightbox-nav lightbox-next"
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox('next');
            }}
            aria-label="Next image"
          >
            ›
          </button>
          <div className="lightbox-counter">
            {lightboxIndex + 1} / {propertyImages.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
