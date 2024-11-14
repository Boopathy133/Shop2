import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ShopB = () => {
  const location = useLocation();
  const { coinBalance, studentName, allCartItems = [] } = location.state || {};

  const [cart, setCart] = useState(allCartItems);
  const [items] = useState([
    { name: 'Snack Item 1', price: 3 },
    { name: 'Snack Item 2', price: 4 },
  ]);

  const navigate = useNavigate();

  const handleAddToCart = (item) => {
    setCart([...cart, item]);
  };

  const handleProceedToCart = () => {
    navigate('/cart', { state: { cartItems: cart, coinBalance, studentName } });
  };

  const handleGoBack = () => {
    navigate('/balance', { state: { coinBalance, studentName, allCartItems: [...cart] } });
  };

  return (
    <div>
      <h1>Shop B - Snacks</h1>
      <h2>Your Balance: {coinBalance} coins</h2>
      <h3>Items Available:</h3>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.name} - {item.price} coins
            <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
          </li>
        ))}
      </ul>
      <button onClick={handleGoBack}>Previous Page</button>

      {cart.length > 0 && (
        <div>
          <h3>Your Cart Items:</h3>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>{item.name} - {item.price} coins</li>
            ))}
          </ul>
          <button onClick={handleProceedToCart}>Go to Cart</button>
        </div>
      )}
    </div>
  );
};

export default ShopB;
