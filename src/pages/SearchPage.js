import React, { useState } from 'react';
import { DropdownList, NumberPicker } from 'react-widgets';
import propertiesData from '../properties.json';
import "react-widgets/styles.css"; 

function SearchPage() {
  // 1. Set up state for filters
  const [criteria, setCriteria] = useState({
    type: "Any",
    minPrice: 0,
    maxPrice: 2000000,
    minBedrooms: 0,
    maxBedrooms: 10
  });

  // 2. Filter logic 
  const filteredProperties = propertiesData.properties.filter(prop => {
    const matchesType = criteria.type === "Any" || prop.type === criteria.type;
    const matchesPrice = prop.price >= criteria.minPrice && prop.price <= criteria.maxPrice;
    const matchesBeds = prop.bedrooms >= criteria.minBedrooms && prop.bedrooms <= criteria.maxBedrooms;
    
    return matchesType && matchesPrice && matchesBeds;
  });

  return (
    <div style={{ padding: '20px' }}>
      <section className="search-box" style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
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

      <section className="results-grid" style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {filteredProperties.map(prop => (
          <div key={prop.id} style={{ border: '1px solid #ddd', padding: '10px' }}>
            <img src={prop.picture} alt={prop.type} style={{ width: '100%' }} />
            <h3>£{prop.price.toLocaleString()}</h3>
            <p>{prop.location}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default SearchPage;