import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BalancePage = () => {
  const location = useLocation();
  const { coinBalance, studentName, allCartItems = [] } = location.state || {};

  const navigate = useNavigate();

  const handleGoToCart = () => {
    navigate('/cart', { state: { cartItems: allCartItems, coinBalance, studentName } });
  };

  const handleLogout = () => {
    navigate('/'); // Redirect to the Login page
  };

  return (
    <div>
      <button onClick={handleLogout} style={{ position: 'absolute', top: '10px', left: '10px' }}>
        Logout
      </button>
      <h1>Welcome, {studentName}!</h1>
      <h2>Your Account Balance</h2>
      <p><strong>Balance in Coins:</strong> {coinBalance}</p>

      <h2>Available Shops</h2>
      <ul>
        <li>
          <button onClick={() => navigate('/shopA', { state: { coinBalance, studentName, allCartItems } })}>
            Shop A - Stationary
          </button>
        </li>
        <li>
          <button onClick={() => navigate('/shopB', { state: { coinBalance, studentName, allCartItems } })}>
            Shop B - Snacks
          </button>
        </li>
        <li>
          <button onClick={() => navigate('/shopC', { state: { coinBalance, studentName, allCartItems } })}>
            Shop C - Food
          </button>
        </li>
      </ul>

      {/* Show Go to Cart button only */}
      <button onClick={handleGoToCart} disabled={allCartItems.length === 0}>
        Go to Cart
      </button>
    </div>
  );
};

export default BalancePage;
