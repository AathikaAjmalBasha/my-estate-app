import propertiesData from '../properties.json';

describe('Properties JSON Data', () => {
  test('contains exactly 7 properties', () => {
    expect(propertiesData.properties).toHaveLength(7);
  });

  test('each property has required fields', () => {
    propertiesData.properties.forEach((property, index) => {
      expect(property).toHaveProperty('id');
      expect(property).toHaveProperty('type');
      expect(property).toHaveProperty('price');
      expect(property).toHaveProperty('bedrooms');
      expect(property).toHaveProperty('location');
      expect(property).toHaveProperty('description');
      expect(property).toHaveProperty('images');
      expect(property).toHaveProperty('added');
    });
  });

  test('each property has 6-8 images', () => {
    propertiesData.properties.forEach((property) => {
      const imageCount = property.images ? property.images.length : 0;
      expect(imageCount).toBeGreaterThanOrEqual(6);
      expect(imageCount).toBeLessThanOrEqual(8);
    });
  });

  test('property types are valid', () => {
    const validTypes = ['House', 'Flat'];
    propertiesData.properties.forEach((property) => {
      expect(validTypes).toContain(property.type);
    });
  });

  test('properties have valid price values', () => {
    propertiesData.properties.forEach((property) => {
      expect(typeof property.price).toBe('number');
      expect(property.price).toBeGreaterThan(0);
    });
  });
});
