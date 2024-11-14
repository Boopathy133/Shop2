import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const location = useLocation();
  const { studentName } = location.state || {}; // Get studentName from location state, if available
  
  const navigate = useNavigate();
  
  const [subscriptionAmount, setSubscriptionAmount] = useState(''); // State for subscription amount

  const handleSetSubscription = () => {
    const amount = parseFloat(subscriptionAmount); // Parse the subscription amount to a number
    if (!isNaN(amount) && amount > 0) {
      alert(`Subscription amount set successfully! Your subscription amount is ${amount}.`);
      
      // Pass subscription amount and studentName to the BalancePage
      navigate('/balance', { state: { coinBalance: amount, studentName, cartItems: [] } });
    } else {
      alert("Please enter a valid subscription amount.");
    }
  };

  return (
    <div>
      <h1>Welcome to Your Dashboard, {studentName}!</h1>
      <p>This is your personal space where you can manage your subscription and view your balance.</p>

      <div>
        <h2>Set Your Subscription Amount</h2>
        <input
          type="number"
          placeholder="Enter subscription amount"
          value={subscriptionAmount}
          onChange={(e) => setSubscriptionAmount(e.target.value)}
        />
        <button onClick={handleSetSubscription}>Set Amount</button>
      </div>
    </div>
  );
};

export default Dashboard;
