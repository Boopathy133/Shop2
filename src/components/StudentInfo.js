import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const StudentInfo = () => {
  const location = useLocation();
  const { studentID, studentName } = location.state || {};
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(true);

  // Check if a password exists in localStorage for this student
  useEffect(() => {
    const storedPassword = localStorage.getItem(`password_${studentID}`);
    if (storedPassword) {
      setIsFirstTime(false); // Not first time, password already exists
    }
  }, [studentID]);

  // Handle password creation and storage
  const handleCreatePassword = () => {
    if (password === confirmPassword) {
      localStorage.setItem(`password_${studentID}`, password);
      alert("Password set successfully!");
      setIsFirstTime(false);
    } else {
      alert("Passwords do not match. Please try again.");
    }
  };

  // Handle password verification
  const handleLogin = () => {
    const storedPassword = localStorage.getItem(`password_${studentID}`);
    if (enteredPassword === storedPassword) {
      alert("Login successful!");
      navigate('/dashboard', { state: { studentName } }); // Pass studentName to Dashboard
    } else {
      alert("Incorrect password. Please try again.");
    }
  };
  return (
    <div>
      <h1>Welcome, {studentName}!</h1>
      
      {isFirstTime ? (
        <div>
          <h2>Create Your Password</h2>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button onClick={handleCreatePassword}>Set Password</button>
        </div>
      ) : (
        <div>
          <h2>Please Enter Your Password</h2>
          <input
            type="password"
            placeholder="Enter password"
            value={enteredPassword}
            onChange={(e) => setEnteredPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
};

export default StudentInfo;
