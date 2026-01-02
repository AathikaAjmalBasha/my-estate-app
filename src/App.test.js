import { render, screen } from '@testing-library/react';
import App from './App';

test('renders application with navigation', () => {
  render(<App />);
  const navLink = screen.getByText(/home|search/i);
  expect(navLink).toBeInTheDocument();
});
