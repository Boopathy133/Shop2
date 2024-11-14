import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import StudentInfo from './components/StudentInfo';
import Dashboard from './components/Dashboard';
import BalancePage from './components/BalancePage';
import ShopA from './components/ShopA';
import ShopB from './components/ShopB';
import ShopC from './components/ShopC';
import CartPage from './components/CartPage';
import AdminPanel from './components/AdminPanel';

// Open Admin Panel in a New Window
const openAdminPanel = () => {
  window.open("/admin", "_blank", "width=600,height=800");  // Adjust dimensions as needed
};
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/student-info" element={<StudentInfo />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/balance" element={<BalancePage />} />
        <Route path="/shopA" element={<ShopA />} />
        <Route path="/shopB" element={<ShopB />} />
        <Route path="/shopC" element={<ShopC />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/admin" element={<AdminPanel/>} />
      </Routes>
    </Router>
  );
}

export default App;
