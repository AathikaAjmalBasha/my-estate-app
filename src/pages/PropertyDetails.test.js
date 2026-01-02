import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import PropertyDetails from './PropertyDetails';
import propertiesData from '../properties.json';

describe('PropertyDetails Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('renders property details for valid property ID', () => {
    const testProperty = propertiesData.properties[0];
    render(
      <MemoryRouter initialEntries={[`/property/${testProperty.id}`]}>
        <PropertyDetails />
      </MemoryRouter>
    );
    
    // Check if price is displayed
    const priceRegex = new RegExp(testProperty.price.toLocaleString());
    expect(screen.getByText(priceRegex)).toBeInTheDocument();
  });

  test('displays favorite button', () => {
    render(
      <MemoryRouter initialEntries={['/property/prop1']}>
        <PropertyDetails />
      </MemoryRouter>
    );
    const favoriteButton = screen.getByLabelText(/favorite/i) || screen.getByText(/save/i);
    expect(favoriteButton).toBeInTheDocument();
  });

  test('renders tabs navigation', () => {
    render(
      <MemoryRouter initialEntries={['/property/prop1']}>
        <PropertyDetails />
      </MemoryRouter>
    );
    expect(screen.getByText(/description/i)).toBeInTheDocument();
    expect(screen.getByText(/floor plan/i)).toBeInTheDocument();
    expect(screen.getByText(/map/i)).toBeInTheDocument();
  });
});
