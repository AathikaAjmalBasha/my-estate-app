import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SearchPage from './SearchPage';
import propertiesData from '../properties.json';

// Helper function to render component with router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('SearchPage Component', () => {
  test('renders search heading', () => {
    renderWithRouter(<SearchPage />);
    const heading = screen.getByText(/search properties/i);
    expect(heading).toBeInTheDocument();
  });

  test('renders postcode search input', () => {
    renderWithRouter(<SearchPage />);
    const postcodeInput = screen.getByPlaceholderText(/postcode area/i);
    expect(postcodeInput).toBeInTheDocument();
  });

  test('renders search button', () => {
    renderWithRouter(<SearchPage />);
    const searchButton = screen.getByRole('button', { name: /search/i });
    expect(searchButton).toBeInTheDocument();
  });

  test('renders favorites sidebar', () => {
    renderWithRouter(<SearchPage />);
    const favoritesHeading = screen.getByText(/my favorites/i);
    expect(favoritesHeading).toBeInTheDocument();
  });

  test('displays properties from JSON data', () => {
    renderWithRouter(<SearchPage />);
    // Check if at least one property price is displayed
    const priceElements = screen.getAllByText(/£/);
    expect(priceElements.length).toBeGreaterThan(0);
  });
});
