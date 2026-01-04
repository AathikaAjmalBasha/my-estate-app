import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import SearchPage from './pages/SearchPage';
import PropertyDetails from './pages/PropertyDetails';
import FavoritesPage from './pages/FavoritesPage';

function App() {
  // Set basename for GitHub Pages deployment
  const basename = process.env.PUBLIC_URL || '';
  
  return (
    <Router basename={basename}>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Routes>
    </Router>
  );
}

export default App;