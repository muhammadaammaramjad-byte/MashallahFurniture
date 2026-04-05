// Home/Home.test.js
import { describe, it, expect, vi } from 'vitest';
import { renderProductGrid } from './home.js';

describe('Home Page', () => {
  it('should render products correctly', () => {
    const mockProducts = [{ id: 1, name: 'Test Product' }];
    const container = document.createElement('div');
    renderProductGrid(container, mockProducts);
    expect(container.querySelector('.product-card')).toBeTruthy();
  });
});