import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX, FiPackage } from 'react-icons/fi';
import ProductCard from './ProductCard';
import { catalogAPI } from '../../services/api';

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || '';
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    categories: categoryQuery ? [categoryQuery] : [],
    minPrice: '',
    maxPrice: '',
    sort: 'newest'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, searchParams]); // Re-fetch when URL changes

  const fetchCategories = async () => {
    try {
      const response = await catalogAPI.getCategories();
      const catData = response.data;
      const cats = Array.isArray(catData) ? catData : (catData.results || []);
      setCategories(cats.map(c => c.name));
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      // In a real app we'd pass all filters to the API
      
      const response = await catalogAPI.getProducts(params);
      
      // Handle Django paginated response vs flat array
      const prodData = response.data;
      let filtered = Array.isArray(prodData) ? prodData : (prodData.results || []);
      
      if (filters.categories.length > 0) {
        filtered = filtered.filter(p => filters.categories.includes(p.category_name) || filters.categories.includes(p.category));
      }
      if (filters.minPrice) {
        filtered = filtered.filter(p => p.price >= Number(filters.minPrice));
      }
      if (filters.maxPrice) {
        filtered = filtered.filter(p => p.price <= Number(filters.maxPrice));
      }
      
      // Sorting
      if (filters.sort === 'price_asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (filters.sort === 'price_desc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (filters.sort === 'rating') {
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }
      
      setProducts(filtered);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Re-apply client filters when filter state changes
  useEffect(() => {
    if (!loading && products.length > 0) {
      fetchProducts();
    }
  }, [filters]);

  const handleCategoryChange = (category) => {
    setFilters(prev => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories: newCategories };
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const SkeletonCard = () => (
    <div className="product-card skeleton">
      <div className="skeleton-image"></div>
      <div className="product-info">
        <div className="skeleton-text skeleton-category"></div>
        <div className="skeleton-text skeleton-title"></div>
        <div className="skeleton-text skeleton-title w-70"></div>
        <div className="skeleton-text skeleton-price"></div>
      </div>
    </div>
  );

  return (
    <div className="products-page">
      <div className="products-header">
        <h1 className="page-title">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Our Products'}
        </h1>
        <p className="results-count">
          {loading ? 'Loading...' : `Showing ${products.length} products`}
        </p>
        <button 
          className="mobile-filters-toggle mobile-only"
          onClick={() => setIsMobileFiltersOpen(true)}
        >
          <FiFilter /> Filters
        </button>
      </div>

      <div className="products-layout">
        {/* Sidebar Filters */}
        <aside className={`products-sidebar ${isMobileFiltersOpen ? 'open' : ''}`}>
          <div className="sidebar-header mobile-only">
            <h3>Filters</h3>
            <button onClick={() => setIsMobileFiltersOpen(false)}><FiX /></button>
          </div>
          
          <div className="filter-group">
            <h4 className="filter-title">Sort By</h4>
            <select 
              name="sort" 
              className="filter-select"
              value={filters.sort}
              onChange={handleFilterChange}
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          <div className="filter-group">
            <h4 className="filter-title">Categories</h4>
            <div className="checkbox-list">
              {categories.map(category => (
                <label key={category} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  <span className="checkbox-custom"></span>
                  {category}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4 className="filter-title">Price Range</h4>
            <div className="price-inputs">
              <input
                type="number"
                name="minPrice"
                placeholder="Min"
                value={filters.minPrice}
                onChange={handleFilterChange}
                min="0"
              />
              <span>-</span>
              <input
                type="number"
                name="maxPrice"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                min="0"
              />
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="products-main">
          {error && <div className="error-message">{error}</div>}
          
          {loading ? (
            <div className="product-grid">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length > 0 ? (
            <div className="product-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon"><FiPackage /></div>
              <h3>No products found</h3>
              <p>We couldn't find any products matching your criteria.</p>
              <button 
                className="btn-outline"
                onClick={() => {
                  setFilters({ categories: [], minPrice: '', maxPrice: '', sort: 'newest' });
                  setSearchParams({});
                }}
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Simple Pagination */}
          {!loading && products.length > 0 && (
            <div className="pagination">
              <button className="page-btn" disabled>Prev</button>
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <button className="page-btn">Next</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
