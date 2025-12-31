import React, { useState } from 'react';
import { DropdownList, NumberPicker, DateTimePicker } from 'react-widgets';
import propertiesData from '../properties.json';
import "react-widgets/styles.css"; 
import { Link } from 'react-router-dom';
import '../index.css';

// Utility function to extract postcode area code (e.g., BR, NW, SE, W) from location string
const extractPostcodeArea = (location) => {
  if (!location) return null;
  // UK postcode pattern: letters followed by numbers (e.g., BR5, NW1, SE10, W1)
  // Extract just the letter part (area code) like BR, NW, SE, W
  const postcodeMatch = location.match(/\b([A-Z]{1,2})[0-9]/i);
  if (postcodeMatch) {
    return postcodeMatch[1].toUpperCase();
  }
  return null;
};

// Utility function to extract area code from user input (handles both "NW" and "NW1" -> "NW")
const extractAreaCodeFromInput = (input) => {
  if (!input) return "";
  // If it contains numbers, extract just the letters; otherwise return uppercase letters
  const match = input.match(/^([A-Z]{1,2})/i);
  return match ? match[1].toUpperCase() : input.toUpperCase();
};

// Utility function to convert property date to Date object
const parsePropertyDate = (added) => {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const monthIndex = monthNames.indexOf(added.month);
  return new Date(added.year, monthIndex, added.day);
};

function SearchPage() {
  // Calculate min and max prices from properties and get unique sorted prices
  const prices = propertiesData.properties.map(prop => prop.price);
  const minPriceFromData = Math.min(...prices);
  const maxPriceFromData = Math.max(...prices);
  
  // Get unique prices and sort them
  const uniquePrices = [...new Set(prices)].sort((a, b) => a - b);
  
  // Generate price options for dropdowns (use all unique prices)
  const priceOptions = uniquePrices;

  // 1. State for Filter Form Inputs
  const [criteria, setCriteria] = useState({
    postcodeArea: "",
    type: "Any",
    minPrice: minPriceFromData,
    maxPrice: maxPriceFromData,
    minBedrooms: 0,
    maxBedrooms: 10,
    dateMode: "after", // "after" or "between"
    dateFrom: "",
    dateTo: ""
  });

  // State for Active Filters (applied when search button is clicked)
  const [activeFilters, setActiveFilters] = useState({
    postcodeArea: "",
    type: "Any",
    minPrice: minPriceFromData,
    maxPrice: maxPriceFromData,
    minBedrooms: 0,
    maxBedrooms: 10,
    dateMode: "after",
    dateFrom: "",
    dateTo: ""
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

  // 4. Handle Search Button Click
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setActiveFilters({ ...criteria });
  };

  // 5. Filter logic based on active filters
  const filteredProperties = propertiesData.properties.filter(prop => {
    // Postcode area filter - match by area code only (e.g., "NW" matches "NW1", "NW2", etc.)
    const propPostcodeArea = extractPostcodeArea(prop.location);
    const searchAreaCode = extractAreaCodeFromInput(activeFilters.postcodeArea);
    const matchesPostcode = !activeFilters.postcodeArea || 
      (propPostcodeArea && propPostcodeArea === searchAreaCode);

    // Type filter
    const matchesType = activeFilters.type === "Any" || prop.type === activeFilters.type;

    // Price filter
    const matchesPrice = prop.price >= activeFilters.minPrice && prop.price <= activeFilters.maxPrice;

    // Bedrooms filter
    const matchesBeds = prop.bedrooms >= activeFilters.minBedrooms && prop.bedrooms <= activeFilters.maxBedrooms;

    // Date filter
    let matchesDate = true;
    if (activeFilters.dateFrom) {
      const propDate = parsePropertyDate(prop.added);
      const filterDateFrom = new Date(activeFilters.dateFrom);
      filterDateFrom.setHours(0, 0, 0, 0);
      
      if (activeFilters.dateMode === "after") {
        matchesDate = propDate >= filterDateFrom;
      } else if (activeFilters.dateMode === "between") {
        if (activeFilters.dateTo) {
          const filterDateTo = new Date(activeFilters.dateTo);
          filterDateTo.setHours(23, 59, 59, 999);
          matchesDate = propDate >= filterDateFrom && propDate <= filterDateTo;
        } else {
          matchesDate = propDate >= filterDateFrom;
        }
      }
    }

    return matchesPostcode && matchesType && matchesPrice && matchesBeds && matchesDate;
  });

  return (
    <div className="search-container">
      <h2>Search Properties</h2>
      <form className="search-box" onSubmit={handleSearch}>
        <div className="search-filters">
          <div className="filter-group">
            <label htmlFor="postcode-search">Postcode Area</label>
            <input
              id="postcode-search"
              type="text"
              placeholder="e.g. BR, NW, SE (or BR5, NW1)"
              value={criteria.postcodeArea}
              onChange={(e) => setCriteria({...criteria, postcodeArea: e.target.value.toUpperCase()})}
              className="search-input"
              pattern="[A-Za-z]{1,2}[0-9]{0,2}"
              maxLength="5"
              title="Enter postcode area code (e.g., BR, NW, SE) - shows all properties in that area"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="type-filter">Type</label>
            <DropdownList
              id="type-filter"
              data={["Any", "House", "Flat"]}
              value={criteria.type}
              onChange={val => setCriteria({...criteria, type: val})}
              className="filter-dropdown"
              aria-label="Property type"
            />
          </div>

          <div className="filter-group price-group">
            <label htmlFor="price-range">Price Range (£)</label>
            <div className="price-range-container">
              <div className="price-range-display">
                <span className="price-range-min">£{criteria.minPrice.toLocaleString()}</span>
                <span className="price-range-separator">-</span>
                <span className="price-range-max">£{criteria.maxPrice.toLocaleString()}</span>
              </div>
              <div className="price-range-slider-wrapper">
                <input
                  type="range"
                  id="price-range-min"
                  min={minPriceFromData}
                  max={maxPriceFromData}
                  value={criteria.minPrice}
                  onChange={(e) => {
                    const newMinPrice = parseInt(e.target.value);
                    setCriteria({
                      ...criteria,
                      minPrice: newMinPrice,
                      maxPrice: newMinPrice > criteria.maxPrice ? maxPriceFromData : criteria.maxPrice
                    });
                  }}
                  className="price-range-slider price-range-slider-min"
                  aria-label="Minimum price"
                />
                <input
                  type="range"
                  id="price-range-max"
                  min={minPriceFromData}
                  max={maxPriceFromData}
                  value={criteria.maxPrice}
                  onChange={(e) => {
                    const newMaxPrice = parseInt(e.target.value);
                    setCriteria({
                      ...criteria,
                      maxPrice: newMaxPrice,
                      minPrice: newMaxPrice < criteria.minPrice ? minPriceFromData : criteria.minPrice
                    });
                  }}
                  className="price-range-slider price-range-slider-max"
                  aria-label="Maximum price"
                />
                <div 
                  className="price-range-progress"
                  style={{
                    left: `${((criteria.minPrice - minPriceFromData) / (maxPriceFromData - minPriceFromData)) * 100}%`,
                    width: `${((criteria.maxPrice - criteria.minPrice) / (maxPriceFromData - minPriceFromData)) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="filter-group bedrooms-group">
            <label htmlFor="bedrooms-min">Bedrooms</label>
            <div className="bedrooms-inputs">
              <NumberPicker 
                id="bedrooms-min"
                placeholder="Min"
                value={criteria.minBedrooms}
                onChange={val => setCriteria({...criteria, minBedrooms: val || 0})}
                className="bedrooms-input"
                min={0}
                max={10}
                aria-label="Minimum bedrooms"
              />
              <span className="bedrooms-separator" aria-hidden="true">to</span>
              <NumberPicker 
                id="bedrooms-max"
                placeholder="Max"
                value={criteria.maxBedrooms}
                onChange={val => setCriteria({...criteria, maxBedrooms: val || 10})}
                className="bedrooms-input"
                min={0}
                max={10}
                aria-label="Maximum bedrooms"
              />
            </div>
          </div>

          <div className="filter-group date-group">
            <label htmlFor="date-mode">Date Added</label>
            <DropdownList
              id="date-mode"
              data={["After", "Between"]}
              value={criteria.dateMode === "after" ? "After" : "Between"}
              onChange={val => {
                const mode = val === "After" ? "after" : "between";
                setCriteria({...criteria, dateMode: mode, dateTo: mode === "after" ? "" : criteria.dateTo});
              }}
              className="date-mode-select"
              aria-label="Date filter mode"
            />
            <div className="date-inputs">
              <DateTimePicker
                value={criteria.dateFrom ? new Date(criteria.dateFrom) : null}
                onChange={date => setCriteria({...criteria, dateFrom: date ? date.toISOString().split('T')[0] : ""})}
                placeholder="Select date"
                calendarOnly
                aria-label="Date from"
                className="date-picker"
              />
              {criteria.dateMode === "between" && (
                <>
                  <span className="date-separator" aria-hidden="true">to</span>
                  <DateTimePicker
                    value={criteria.dateTo ? new Date(criteria.dateTo) : null}
                    onChange={date => setCriteria({...criteria, dateTo: date ? date.toISOString().split('T')[0] : ""})}
                    placeholder="Select date"
                    min={criteria.dateFrom ? new Date(criteria.dateFrom) : undefined}
                    calendarOnly
                    aria-label="Date to"
                    className="date-picker"
                  />
                </>
              )}
            </div>
          </div>

          <div className="filter-group search-button-group">
            <button type="submit" className="search-button" aria-label="Search properties">
              Search
            </button>
          </div>
        </div>
      </form>

      <section className="results-grid">
        {filteredProperties.length === 0 ? (
          <div className="no-results">
            <p>No properties found matching your search criteria.</p>
            <p>Please try adjusting your filters.</p>
          </div>
        ) : (
          <>
            {filteredProperties.map(prop => {
            const isFav = favorites.some(fav => fav.id === prop.id);
            
            return (
              <div key={prop.id} className="property-card">
                <Link to={`/property/${prop.id}`} className="property-card-link">
                  <img src={prop.picture} alt={`${prop.type} in ${prop.location}`} />
                </Link>
                <div className="card-content">
                  <h3>£{prop.price.toLocaleString()}</h3>
                  <p className="property-location">{prop.location}</p>
                  <p className="property-description">{prop.description}</p>
                  
                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <Link to={`/property/${prop.id}`} style={{ flex: 1 }}>
                      <button className="view-details-btn">View Details</button>
                    </Link>
                    
                    <button 
                      onClick={() => toggleFavorite(prop)}
                      className={`fav-btn ${isFav ? 'active' : ''}`}
                      title={isFav ? "Remove from Saved" : "Save Property"}
                      aria-label={isFav ? "Remove from saved properties" : "Save property"}
                    >
                      {isFav ? '❤️' : '🤍'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '10px', color: '#666', fontSize: '0.9rem' }}>
            Showing {filteredProperties.length} of {propertiesData.properties.length} properties
          </div>
          </>
        )}
      </section>
    </div>
  );
}

export default SearchPage;