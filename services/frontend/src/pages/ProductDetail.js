import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingCart, FiMinus, FiPlus, FiStar, FiChevronRight } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { catalogAPI } from '../services/api';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await catalogAPI.getProduct(id);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    const added = addToCart(product, quantity);
    if (added) {
      toast.success(`${quantity} ${product.name} added to cart`);
    }
  };

  const handleMinus = () => setQuantity(prev => Math.max(1, prev - 1));
  const handlePlus = () => setQuantity(prev => Math.min(product?.stock || 10, prev + 1));

  if (loading) {
    return (
      <div className="product-detail-skeleton">
        <div className="skeleton-image"></div>
        <div className="skeleton-info">
          <div className="skeleton-line"></div>
          <div className="skeleton-line short"></div>
          <div className="skeleton-line long"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="product-not-found">Product not found.</div>;
  }

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<FiStar key={i} className={i <= rating ? 'star-filled' : 'star-empty'} />);
    }
    return stars;
  };

  return (
    <div className="product-detail">
      <div className="product-detail-image">
        {(product.image || (product.images && product.images.length > 0)) ? (
          <img src={product.image || product.images[0]} alt={product.name} />
        ) : (
          <div className="product-detail-placeholder">No Image</div>
        )}
      </div>
      <div className="product-detail-info">
        <div className="product-detail-breadcrumb">
          <Link to="/">Home</Link> <FiChevronRight /> <Link to="/products">Products</Link> <FiChevronRight /> <span>{product.category_details?.name || product.category_name || 'Product'}</span>
        </div>
        <h1>{product.name}</h1>
        <div className="product-detail-rating">
          <div className="product-detail-stars">
            {renderStars(product.rating || 0)}
          </div>
          <span className="product-detail-review-count">({product.review_count || product.reviews_count || 0} reviews)</span>
        </div>
        <div className="product-detail-price-section">
          <span className="product-detail-price">${parseFloat(product.price).toFixed(2)}</span>
          {product.compare_price && (
            <>
              <span className="product-detail-compare-price">${parseFloat(product.compare_price).toFixed(2)}</span>
              <span className="product-detail-discount">
                {Math.round((1 - product.price / product.compare_price) * 100)}% OFF
              </span>
            </>
          )}
        </div>
        <p className="product-detail-description">{product.description}</p>
        
        {product.stock > 0 ? (
          <div className="product-detail-stock in-stock">In Stock ({product.stock} available)</div>
        ) : (
          <div className="product-detail-stock out-of-stock">Out of Stock</div>
        )}
        
        {product.stock > 0 && (
          <div className="product-detail-quantity">
            <div className="product-detail-qty-controls">
              <button className="product-detail-qty-btn" onClick={handleMinus} disabled={quantity <= 1}><FiMinus /></button>
              <div className="product-detail-qty-value">{quantity}</div>
              <button className="product-detail-qty-btn" onClick={handlePlus} disabled={quantity >= (product.stock || 10)}><FiPlus /></button>
            </div>
            <button className="product-detail-add-btn" onClick={handleAddToCart}>
              <FiShoppingCart /> Add to Cart
            </button>
          </div>
        )}
        
        <div className="product-detail-meta">
          <p><strong>SKU:</strong> {product.sku || 'N/A'}</p>
          <p><strong>Category:</strong> {product.category_details?.name || product.category_name || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
