// Test for HTML encoding utility function
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

describe('escapeHtml utility function', () => {
  test('escapes HTML special characters correctly', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
    expect(escapeHtml('Test & More')).toBe('Test &amp; More');
    expect(escapeHtml("It's a test")).toBe('It&#039;s a test');
  });

  test('handles empty strings and null values', () => {
    expect(escapeHtml('')).toBe('');
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
  });

  test('does not escape safe text', () => {
    expect(escapeHtml('Normal text')).toBe('Normal text');
    expect(escapeHtml('123')).toBe('123');
  });
});
