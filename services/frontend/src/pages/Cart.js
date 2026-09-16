import React from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiShoppingCart, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();
  const tax = cartTotal * 0.08;
  const grandTotal = cartTotal + tax;

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <div className="cart-empty-icon">🛍️</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet</p>
          <Link to="/products" className="cart-empty-btn">
            <FiShoppingCart /> Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="cart-title">
        Shopping Cart <span className="cart-count-badge">{items.length} items</span>
      </h1>
      <div className="cart-content">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="cart-item-placeholder">📦</div>
                )}
              </div>
              <div className="cart-item-details">
                <Link to={`/product/${item.id}`} className="cart-item-name">{item.name}</Link>
                <span className="cart-item-price">${parseFloat(item.price).toFixed(2)}</span>
              </div>
              <div className="cart-item-quantity">
                <button
                  className="cart-qty-btn"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <FiMinus />
                </button>
                <span className="cart-qty-value">{item.quantity}</span>
                <button
                  className="cart-qty-btn"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <FiPlus />
                </button>
              </div>
              <div className="cart-item-total">
                ${(parseFloat(item.price) * item.quantity).toFixed(2)}
              </div>
              <button
                className="cart-item-remove"
                onClick={() => removeFromCart(item.id)}
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="cart-summary-card">
            <h3>Order Summary</h3>
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Shipping</span>
              <span className="cart-free-shipping">Free</span>
            </div>
            <div className="cart-summary-row">
              <span>Estimated Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="cart-summary-divider"></div>
            <div className="cart-summary-row cart-summary-total">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="cart-checkout-btn">
              Proceed to Checkout <FiArrowRight />
            </Link>
            <Link to="/products" className="cart-continue-link">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
