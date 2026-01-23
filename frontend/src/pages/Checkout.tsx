import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import OnboardingProgressBar from '../components/OnboardingProgressBar';
import './Checkout.css';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { item, checkout, isLoading } = useShoppingCart();
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSecure3D, setShowSecure3D] = useState(false);

  if (!item) {
    navigate('/onboarding/shop');
    return null;
  }

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate initial Stripe validation
    setTimeout(() => {
      setShowSecure3D(true);
    }, 1500);
  };

  const handleSecureConfirm = async () => {
    setIsProcessing(true);
    try {
      await checkout(); // This calls the mock backend purchase
      navigate('/dashboard');
    } catch (error) {
      console.error('Payment failed:', error);
      setIsProcessing(false);
      setShowSecure3D(false);
    }
  };

  return (
    <div className="onboarding-page checkout-page">
      <OnboardingProgressBar />

      <div className="checkout-container">
        <div className="checkout-form-side">
          <h1>Payment Details</h1>
          <p className="subtitle">Securely complete your purchase</p>

          <form onSubmit={handlePayment}>
            <div className="field">
              <label>Name on Card</label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="field">
              <label>Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').substring(0, 16))}
                placeholder="0000 0000 0000 0000"
                required
              />
            </div>

            <div className="row">
              <div className="field">
                <label>Expiry Date</label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div className="field">
                <label>CVV</label>
                <input
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.substring(0, 3))}
                  placeholder="123"
                  required
                />
              </div>
            </div>

            <div className="secure-badge">
              <span>🔒 SSL Secure Connection</span>
              <span className="stripe-powered">Powered by Stripe</span>
            </div>

            <button type="submit" className="btn-pay" disabled={isProcessing || isLoading}>
              {isProcessing ? 'Validating...' : `Pay (Placeholder) $${item.price}.00`}
            </button>
          </form>
        </div>

        <div className="order-summary-side">
          <h3>Order Summary</h3>
          <div className="item-row">
            <div className="item-name">
              <strong>{item.name}</strong>
              <span>at {item.restaurantName}</span>
            </div>
            <div className="item-price">${item.price}.00</div>
          </div>
          <div className="summary-total">
            <span>Total amount</span>
            <span>${item.price}.00</span>
          </div>
          <div className="order-protection">
            <p>🛡️ Your purchase is protected. You can cancel or change your package within 24 hours.</p>
          </div>
        </div>
      </div>

      {showSecure3D && (
        <div className="modal-overlay">
          <div className="secure-3d-modal">
            <div className="bank-logo">SafeBank Secure</div>
            <div className="modal-body">
              <div className="loader-line"></div>
              <h2>Placeholder Payment</h2>
              <p>When implemented in production this is where the stripe transaction will be confirmed.</p>
              <div className="payment-details">
                <div className="pd-row"><span>Merchant:</span> <span>LSDN Marketplace</span></div>
                <div className="pd-row"><span>Amount:</span> <span>${item.price}.00</span></div>
                <div className="pd-row"><span>Date:</span> <span>{new Date().toLocaleDateString()}</span></div>
              </div>
            </div>
            <button
              onClick={handleSecureConfirm}
              className="btn-confirm-payment"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Confirm Payment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
