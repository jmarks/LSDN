import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import OnboardingProgressBar from '../components/OnboardingProgressBar';
import './ShoppingCart.css';

const ShoppingCart: React.FC = () => {
  const navigate = useNavigate();
  const { item, removeFromCart } = useShoppingCart();

  if (!item) {
    return (
      <div className="onboarding-page empty-cart">
        <OnboardingProgressBar />
        <div className="empty-cart-content">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Please select a date package to continue with your onboarding.</p>
          <button onClick={() => navigate('/onboarding/shop')} className="btn-back-to-shop">
            Browse Packages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-page shopping-cart-page">
      <OnboardingProgressBar />

      <div className="cart-container">
        <h1>Review your selection</h1>
        <p className="subtitle">You're one step away from starting your journey.</p>

        <div className="cart-item-card">
          <div className="item-main">
            <div className="item-info">
              <span className="restaurant-tag">{item.restaurantName}</span>
              <h3>{item.name}</h3>
              <ul className="item-benefits">
                <li>• 5 Pre-paid date reservations</li>
                <li>• Guaranteed table at {item.restaurantName}</li>
                <li>• Priority matching</li>
              </ul>
            </div>
            <div className="item-price-section">
              <span className="price-label">Total Price</span>
              <span className="price-value">${item.price}</span>
            </div>
          </div>

          <div className="item-actions">
            <button onClick={() => navigate('/onboarding/shop')} className="btn-change">
              Change Package
            </button>
            <button onClick={removeFromCart} className="btn-remove">
              Remove
            </button>
          </div>
        </div>

        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${item.price}.00</span>
          </div>
          <div className="summary-row">
            <span>Service Fee</span>
            <span>$0.00</span>
          </div>
          <div className="summary-row total">
            <span>Total to pay</span>
            <span>${item.price}.00</span>
          </div>
        </div>

        <button
          className="btn-proceed-to-checkout"
          onClick={() => navigate('/onboarding/checkout')}
        >
          Secure Checkout
        </button>
      </div>
    </div>
  );
};

export default ShoppingCart;
