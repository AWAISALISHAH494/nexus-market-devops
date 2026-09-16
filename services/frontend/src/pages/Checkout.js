import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiCreditCard, FiTruck, FiCheck, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { orderAPI, paymentAPI } from '../services/api';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [shipping, setShipping] = useState({
    full_name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'US',
    phone: '',
  });

  const tax = cartTotal * 0.08;
  const grandTotal = cartTotal + tax;

  const handleShippingChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Validate required fields
    const required = ['full_name', 'address_line1', 'city', 'state', 'zip_code'];
    for (const field of required) {
      if (!shipping[field].trim()) {
        toast.error(`Please fill in ${field.replace(/_/g, ' ')}`);
        return;
      }
    }

    setLoading(true);
    try {
      // 1. Create order
      const orderPayload = {
        items: items.map((item) => ({
          product_id: String(item.product.id),
          name: item.product.name,
          price: parseFloat(item.product.price),
          quantity: item.quantity,
          image: item.product.image || (item.product.images && item.product.images[0]) || '',
        })),
        shipping_address: shipping,
        total_amount: grandTotal,
      };

      const orderRes = await orderAPI.createOrder(orderPayload);
      const orderId = orderRes.data._id || orderRes.data.id;

      // 2. Process payment
      await paymentAPI.processPayment({
        order_id: orderId,
        amount: grandTotal,
        method: 'mock',
      });

      // 3. Clear cart
      clearCart();

      // 4. Success
      toast.success('🎉 Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Checkout error:', error);
      const errData = error.response?.data;
      const errMsg = errData?.error || errData?.message || error.message || 'Failed to place order. Please try again.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some products before checking out</p>
          <Link to="/products" className="cart-empty-btn">
            <FiShoppingCart /> Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>
      <form className="checkout-content" onSubmit={handlePlaceOrder}>
        <div className="checkout-left">
          {/* Shipping Information */}
          <div className="checkout-section">
            <h2 className="checkout-section-title">
              <FiTruck /> Shipping Information
            </h2>
            <div className="checkout-form-grid">
              <div className="checkout-field checkout-field-full">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="full_name"
                  value={shipping.full_name}
                  onChange={handleShippingChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="checkout-field checkout-field-full">
                <label>Address Line 1 *</label>
                <input
                  type="text"
                  name="address_line1"
                  value={shipping.address_line1}
                  onChange={handleShippingChange}
                  placeholder="123 Main Street"
                  required
                />
              </div>
              <div className="checkout-field checkout-field-full">
                <label>Address Line 2</label>
                <input
                  type="text"
                  name="address_line2"
                  value={shipping.address_line2}
                  onChange={handleShippingChange}
                  placeholder="Apt 4B"
                />
              </div>
              <div className="checkout-field">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={shipping.city}
                  onChange={handleShippingChange}
                  placeholder="New York"
                  required
                />
              </div>
              <div className="checkout-field">
                <label>State *</label>
                <input
                  type="text"
                  name="state"
                  value={shipping.state}
                  onChange={handleShippingChange}
                  placeholder="NY"
                  required
                />
              </div>
              <div className="checkout-field">
                <label>ZIP Code *</label>
                <input
                  type="text"
                  name="zip_code"
                  value={shipping.zip_code}
                  onChange={handleShippingChange}
                  placeholder="10001"
                  required
                />
              </div>
              <div className="checkout-field">
                <label>Country</label>
                <select name="country" value={shipping.country} onChange={handleShippingChange}>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
              <div className="checkout-field checkout-field-full">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={shipping.phone}
                  onChange={handleShippingChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="checkout-section">
            <h2 className="checkout-section-title">
              <FiCreditCard /> Payment Method
            </h2>
            <div className="checkout-demo-notice">
              <FiCheck /> This is a demo — no real charges will be made
            </div>
            <div className="checkout-form-grid">
              <div className="checkout-field checkout-field-full">
                <label>Card Number</label>
                <input type="text" value="4242 4242 4242 4242" readOnly />
              </div>
              <div className="checkout-field">
                <label>Expiry Date</label>
                <input type="text" value="12/28" readOnly />
              </div>
              <div className="checkout-field">
                <label>CVV</label>
                <input type="text" value="123" readOnly />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="checkout-right">
          <div className="checkout-summary">
            <h3>Order Summary</h3>
            <div className="checkout-summary-items">
              {items.map((item) => (
                <div key={item.product.id} className="checkout-summary-item">
                  <div className="checkout-summary-item-info">
                    <span className="checkout-summary-item-name">{item.product.name}</span>
                    <span className="checkout-summary-item-details" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      ${parseFloat(item.product.price).toFixed(2)} each × {item.quantity}
                    </span>
                  </div>
                  <span>${(parseFloat(item.product.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="cart-summary-divider"></div>
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Shipping</span>
              <span className="cart-free-shipping">Free</span>
            </div>
            <div className="cart-summary-row">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="cart-summary-divider"></div>
            <div className="cart-summary-row cart-summary-total">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
            <button
              type="submit"
              className="checkout-place-order-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="checkout-spinner"></span>
              ) : (
                <>
                  <FiCheck /> Place Order
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
