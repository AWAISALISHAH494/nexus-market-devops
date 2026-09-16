import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTruck, FiShield, FiClock, FiPackage, FiArrowRight } from 'react-icons/fi';
import ProductCard from '../components/products/ProductCard';
import { catalogAPI } from '../services/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await catalogAPI.getProducts();
        const prodData = prodRes.data;
        const products = Array.isArray(prodData) ? prodData : (prodData.results || []);
        setFeaturedProducts(products.slice(0, 8));

        const catRes = await catalogAPI.getCategories();
        const catData = catRes.data;
        const cats = Array.isArray(catData) ? catData : (catData.results || []);
        
        const defaultEmojis = ['⚡', '👗', '🏠', '⚽', '📚', '✨', '📦', '📱', '🎮'];
        const formattedCats = cats.slice(0, 6).map((c, i) => ({
           name: c.name,
           slug: c.slug || c.name,
           emoji: defaultEmojis[i % defaultEmojis.length],
           count: 'View Products'
        }));
        
        setCategories(formattedCats.length > 0 ? formattedCats : [
          { name: 'Electronics', slug: 'electronics', emoji: '⚡', count: 'View Products' },
          { name: 'Fashion', slug: 'fashion', emoji: '👗', count: 'View Products' }
        ]);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const features = [
    { icon: <FiTruck />, title: 'Free Shipping', description: 'Free worldwide shipping on orders over $50' },
    { icon: <FiShield />, title: 'Secure Payment', description: 'Your payment information is always protected' },
    { icon: <FiClock />, title: '24/7 Support', description: 'Get help anytime with our round-the-clock support' },
    { icon: <FiPackage />, title: 'Easy Returns', description: '30-day hassle-free return policy' }
  ];

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-content">
          <div className="home-hero-blob blob-1"></div>
          <div className="home-hero-blob blob-2"></div>
          <div className="home-hero-blob blob-3"></div>
          <h1>Discover Premium Products</h1>
          <p>Shop the future with Nexus Market. Premium quality, unbeatable prices.</p>
          <Link to="/products" className="btn-gradient">Shop Now <FiArrowRight /></Link>
        </div>
      </section>

      <section className="home-section home-featured">
        <h2 className="home-section-title">Featured Products<span></span></h2>
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : featuredProducts.length > 0 ? (
          <div className="home-products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p>No featured products found.</p>
        )}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/products" className="btn-text">View All Products <FiArrowRight /></Link>
        </div>
      </section>

      <section className="home-section home-categories">
        <h2 className="home-section-title">Shop by Category</h2>
        <div className="home-categories-grid">
          {categories.map((cat, index) => (
            <Link key={index} to="/products" className="home-category-card">
              <div className="category-emoji">{cat.emoji}</div>
              <h3>{cat.name}</h3>
              <p>{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section home-features">
        <h2 className="home-section-title">Why Choose Nexus Market</h2>
        <div className="home-features-grid">
          {features.map((feat, index) => (
            <div key={index} className="feature-card glassmorphism">
              <div className="feature-icon">{feat.icon}</div>
              <h3>{feat.title}</h3>
              <p>{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-newsletter">
        <div className="newsletter-content">
          <h2>Stay Updated</h2>
          <p>Subscribe to get special offers and updates</p>
          <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" required />
            <button type="submit" className="btn-gradient">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
