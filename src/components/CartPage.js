import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CartPage = () => {
  const location = useLocation();
  const { cartItems = [], coinBalance, studentName } = location.state || {};
  const navigate = useNavigate();

  // Calculate the total price of all cart items
  const totalAmount = cartItems.reduce((total, item) => total + item.price, 0);

  // Handle proceed to buy and update balance
  const handleProceedToBuy = () => {
    if (coinBalance >= totalAmount) {
      const updatedBalance = coinBalance - totalAmount; // Deduct amount from balance
      alert(`Purchase successful! You spent ${totalAmount} coins. Your new balance is ${updatedBalance} coins.`);
      navigate('/balance', { state: { coinBalance: updatedBalance, studentName, allCartItems: [] } });
    } else {
      alert('Not enough balance to complete the purchase.');
    }
  };

  const handleGoBack = () => {
    navigate('/balance', { state: { coinBalance, studentName, allCartItems: cartItems } });
  };

  return (
    <div>
      <h1>Your Cart</h1>
      <h2>{studentName}'s Cart</h2>
      <h3>Total Amount: {totalAmount} coins</h3>

      {cartItems.length > 0 ? (
        <ul>
          {cartItems.map((item, index) => (
            <li key={index}>
              {item.name} - {item.price} coins
            </li>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty.</p>
      )}

      <button onClick={handleProceedToBuy} disabled={totalAmount === 0}>
        Proceed to Buy
      </button>
      <button onClick={handleGoBack}>Go Back</button>
    </div>
  );
};

export default CartPage;
