// import React from 'react';
// // import { useLocation, useNavigate } from 'react-router-dom';

// const Dashboard = () => {
//   // const location = useLocation();
//   // const { studentName } = location.state || {}; // Get studentName from location state, if available
  
//   // const navigate = useNavigate();
  
//   // const [subscriptionAmount, setSubscriptionAmount] = useState(''); // State for subscription amount

//   // const handleSetSubscription = () => {
//   //   const amount = parseFloat(subscriptionAmount); // Parse the subscription amount to a number
//   //   if (!isNaN(amount) && amount > 0) {
//   //     alert(`Subscription amount set successfully! Your subscription amount is ${amount}.`);
      
//   //     // Pass subscription amount and studentName to the BalancePage
//   //     navigate('/balance', { state: { coinBalance: amount, studentName, cartItems: [] } });
//   //   } else {
//   //     alert("Please enter a valid subscription amount.");
//   //   }
//   // };

//   return (
//     <div>
//       {/* <h1>Welcome to Your Dashboard, {studentName}!</h1> */}
//       <h1>Welcome to Your Dashboard, Boopathy !</h1>
//       {/* <p>This is your personal space where you can manage your subscription and view your balance.</p> */}

//       {/* <div>
//         <h2>Set Your Subscription Amount</h2>
//         <input
//           type="number"
//           placeholder="Enter subscription amount"
//           value={subscriptionAmount}
//           onChange={(e) => setSubscriptionAmount(e.target.value)}
//         />
//         <button onClick={handleSetSubscription}>Set Amount</button>
//       </div> */}
//     </div>
//   );
// };

// export default Dashboard;










// import React, { useState, useEffect } from "react";

// const Dashboard = () => {
//   const [shops, setShops] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [selectedShop, setSelectedShop] = useState("");
//   const [error, setError] = useState("");

//   // Fetch all shops
//   useEffect(() => {
//     fetch("http://localhost:5000/shops")
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to fetch shops");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setShops(data);
//         setError("");
//       })
//       .catch((err) => setError(err.message));
//   }, []);

//   // Fetch products for a selected shop
//   const fetchProducts = (shopName) => {
//     setSelectedShop(shopName);
//     fetch(`http://localhost:5000/products/${shopName}`)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to fetch products");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setProducts(data);
//         setError("");
//       })
//       .catch((err) => setError(err.message));
//   };

//   return (
//     <div className="p-4">
//       {/* <h1>Welcome to Your Dashboard, {studentName}!</h1> */}
//       {/* <h1 className="text-2xl font-bold mb-4">Welcome to Your Dashboard, Boopathy!</h1> */}
//       {/* <h1 className="text-2xl font-bold mb-4">Dashboard</h1> */}

//       {/* Error Message */}
//       {error && <p className="text-red-500">{error}</p>}

//       {/* Shops */}
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold mb-2">Shops Available</h2>
//         <div className="grid grid-cols-5 gap-2">
//           {shops.length > 0 ? (
//             shops.map((shop, index) => (
//               <button
//                 key={index}
//                 onClick={() => fetchProducts(shop.shopName)}
//                 className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//               >
//                 {shop.shopName} ({shop.shopOwner})
//               </button>
//             ))
//           ) : (
//             <p>No shops available</p>
//           )}
//         </div>
//       </div>

//       {/* Products */}
//       {selectedShop && (
//         <div>
//           <h2 className="text-xl font-semibold mb-2">
//             Products for {selectedShop}
//           </h2>
//           {products.length > 0 ? (
//             <table className="w-full border border-gray-300">
//               <thead>
//                 <tr>
//                   <th className="border px-4 py-2">Product Name</th>
//                   <th className="border px-4 py-2">Price</th>
//                   <th className="border px-4 py-2">Quantity</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {products.map((product, index) => (
//                   <tr key={index}>
//                     <td className="border px-4 py-2">{product.productName}</td>
//                     <td className="border px-4 py-2">{product.price}</td>
//                     <td className="border px-4 py-2">{product.quantity}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p>No products found for this shop.</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

















import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const Dashboard = () => {
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedShop, setSelectedShop] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();

  // Retrieve userID and username from location state
  const { userID, username } = location.state || {};

  // Fetch all shops
  useEffect(() => {
    fetch("http://localhost:5000/shops")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch shops");
        }
        return response.json();
      })
      .then((data) => {
        setShops(data);
        setError("");
      })
      .catch((err) => setError(err.message));
  }, []);

  // Fetch products for a selected shop
  const fetchProducts = (shopName) => {
    setSelectedShop(shopName);
    fetch(`http://localhost:5000/products/${shopName}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setError("");
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="p-4">
      {/* Display username */}
      {username && <h1 className="text-2xl font-bold mb-4">Welcome, {username}!</h1>}
      {/* {userID ? (
        <div>
          <p><strong>User ID:</strong> {userID}</p>
          <p><strong>Coins:</strong> {coins}</p>
        </div>
      ) : (
        <p>User information is not available.</p>
      )} */}

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Shops */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Shops Available</h2>
        <div className="grid grid-cols-5 gap-2">
          {shops.length > 0 ? (
            shops.map((shop, index) => (
              <button
                key={index}
                onClick={() => fetchProducts(shop.shopName)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {shop.shopName} ({shop.shopOwner})
              </button>
            ))
          ) : (
            <p>No shops available</p>
          )}
        </div>
      </div>

      {/* Products */}
      {selectedShop && (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Products for {selectedShop}
          </h2>
          {products.length > 0 ? (
            <table className="w-full border border-gray-300">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Product Name</th>
                  <th className="border px-4 py-2">Price</th>
                  <th className="border px-4 py-2">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{product.productName}</td>
                    <td className="border px-4 py-2">{product.price}</td>
                    <td className="border px-4 py-2">{product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No products found for this shop.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;





