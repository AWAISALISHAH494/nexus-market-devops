import React, { useState, useEffect } from 'react';
import { 
  FiPackage, FiClock, FiCheck, FiTruck, 
  FiX, FiChevronDown, FiChevronUp 
} from 'react-icons/fi';
import { orderAPI } from '../../services/api';
import { toast } from 'react-toastify';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getUserOrders();
      setOrders(response.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load your order history.');
    } finally {
      setLoading(false);
    }
  };

  const toggleOrder = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const handleCancelOrder = async (orderId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderAPI.cancelOrder(orderId);
        toast.success('Order cancelled successfully');
        // Update local state
        setOrders(orders.map(o => 
          o.id === orderId ? { ...o, status: 'cancelled' } : o
        ));
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to cancel order');
      }
    }
  };

  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return { icon: <FiClock />, color: 'yellow' };
      case 'confirmed': return { icon: <FiCheck />, color: 'blue' };
      case 'processing': return { icon: <FiPackage />, color: 'purple' };
      case 'shipped': return { icon: <FiTruck />, color: 'indigo' };
      case 'delivered': return { icon: <FiCheck />, color: 'green' };
      case 'cancelled': return { icon: <FiX />, color: 'red' };
      default: return { icon: <FiPackage />, color: 'gray' };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="orders-page">
        <h1 className="page-title">My Orders</h1>
        <div className="orders-skeleton">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="order-card skeleton">
              <div className="skeleton-text w-100" style={{ height: '80px' }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1 className="page-title">My Orders</h1>

      {error ? (
        <div className="error-message">{error}</div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><FiPackage /></div>
          <h3>No orders yet</h3>
          <p>Looks like you haven't made any purchases yet.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => {
            const isExpanded = expandedOrders.has(order.id);
            const statusConfig = getStatusConfig(order.status);
            
            return (
              <div key={order.id} className="order-card">
                <div 
                  className="order-header" 
                  onClick={() => toggleOrder(order.id)}
                >
                  <div className="order-header-main">
                    <div className="order-id">
                      Order #{order.id.substring(0, 8).toUpperCase()}
                    </div>
                    <div className="order-date">{formatDate(order.created_at || new Date())}</div>
                  </div>
                  
                  <div className="order-header-right">
                    <div className="order-total">
                      ${Number(order.total_amount).toFixed(2)}
                      <span className="items-count">({order.items?.length || 0} items)</span>
                    </div>
                    
                    <div className={`status-badge status-${statusConfig.color}`}>
                      {statusConfig.icon}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                    
                    <div className="accordion-icon">
                      {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="order-details">
                    <div className="order-items">
                      <h4>Items</h4>
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="order-item">
                          <img 
                            src={item.product?.image_url || 'https://via.placeholder.com/60'} 
                            alt={item.product?.name || 'Product'} 
                            className="item-image"
                          />
                          <div className="item-info">
                            <div className="item-name">{item.product?.name || 'Unknown Product'}</div>
                            <div className="item-price">
                              ${Number(item.price).toFixed(2)} x {item.quantity}
                            </div>
                          </div>
                          <div className="item-total">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="order-actions">
                      <div className="shipping-info">
                        <h4>Shipping Address</h4>
                        <p>{order.shipping_address || 'Address not provided'}</p>
                      </div>
                      
                      {['pending', 'confirmed'].includes(order.status.toLowerCase()) && (
                        <button 
                          className="btn-danger cancel-btn"
                          onClick={(e) => handleCancelOrder(order.id, e)}
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
