import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiStar, FiEye } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = addToCart(product, 1);
    if (added) {
      toast.success(`${product.name} added to cart`);
    }
  };

  // Calculate discount percentage if compare_price exists
  const discount = product.compare_price 
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-image-container">
        {discount > 0 && (
          <div className="discount-badge">-{discount}%</div>
        )}
        <img 
          src={product.image || (product.images && product.images.length > 0 ? product.images[0] : null) || 'https://via.placeholder.com/300x300?text=Nexus+Market'} 
          alt={product.name} 
          className="product-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
          }}
        />
        <div className="product-image-overlay">
          <button className="quick-view-btn">
            <FiEye /> Quick View
          </button>
        </div>
      </div>
      
      <div className="product-info">
        <div className="product-category">{product.category || 'Uncategorized'}</div>
        <h3 className="product-name" title={product.name}>{product.name}</h3>
        
        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <FiStar 
              key={i} 
              className={i < (product.rating || 4) ? 'star-filled' : 'star-empty'} 
            />
          ))}
          <span className="rating-count">({product.reviews_count || Math.floor(Math.random() * 100) + 5})</span>
        </div>
        
        <div className="product-bottom">
          <div className="product-price-container">
            <span className="product-price">${Number(product.price).toFixed(2)}</span>
            {product.compare_price && (
              <span className="product-compare-price">${Number(product.compare_price).toFixed(2)}</span>
            )}
          </div>
          <button 
            className="add-to-cart-btn" 
            onClick={handleAddToCart}
            aria-label="Add to cart"
          >
            <FiShoppingCart />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
