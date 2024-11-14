import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [newCoins, setNewCoins] = useState({});
  const [usernameToDelete, setUsernameToDelete] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users


  const [shops, setShops] = useState([]);
  const [newShop, setNewShop] = useState({ shopName: '', shopOwner: '' });
  const [selectedShop, setSelectedShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ productName: '', price: '', quantity: '' });

  // useEffect(() => {
  //   // Fetch users when component mounts
  //   axios.get('http://localhost:5000/api/admin/getUsers')
  //     .then(response => {
  //       if (response.data.success) {
  //         setUsers(response.data.users);
  //         setFilteredUsers(response.data.users); // Initially, all users are shown
  //       } else {
  //         alert('Failed to load users');
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error fetching users:', error);
  //       alert('Failed to load users');
  //     });
  // }, []);



  // Fetch users and shops when component mounts
  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/getUsers')
      .then(response => {
        if (response.data.success) {
          setUsers(response.data.users);
          setFilteredUsers(response.data.users); // Initially, all users are shown
        } else {
          alert('Failed to load users');
        }
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        alert('Failed to load users');
      });

    axios.get('http://localhost:5000/api/admin/getShops')
      .then(response => {
        if (response.data.success) {
          setShops(response.data.shops);
        } else {
          alert('Failed to load shops');
        }
      })
      .catch(error => {
        console.error('Error fetching shops:', error);
        alert('Failed to load shops');
      });
  }, []);


  // Update filtered users based on search term
  useEffect(() => {
    // Convert searchTerm to a number to ensure matching works correctly
    const searchId = parseInt(searchTerm, 10);

    // Filter users based on whether the searchTerm is a valid 12-digit userId
    if (!isNaN(searchId) && searchTerm.length === 12) {
      setFilteredUsers(
        users.filter(user => user.userId === searchTerm || user.userId === searchId)
      );
    } else {
      setFilteredUsers(users); // Show all users if search term is empty or invalid
    }
  }, [searchTerm, users]);

  const handleCoinChange = (username, event) => {
    setNewCoins({
      ...newCoins,
      [username]: event.target.value
    });
  };

  const saveCoins = (username) => {
    const addedCoins = parseInt(newCoins[username] || 0);

    if (isNaN(addedCoins) || addedCoins <= 0) {
      alert('Please enter a valid coin value greater than 0.');
      return;
    }

    axios.post('http://localhost:5000/api/admin/updateUserCoins', {
      username,
      newCoins: addedCoins
    })
      .then((response) => {
        if (response.data.success) {
          alert('Coins updated successfully!');
          setUsers(users.map(user =>
            user.username === username
              ? { ...user, coins: user.coins + addedCoins }
              : user
          ));
          setNewCoins({ ...newCoins, [username]: '' }); // Clear the input field after updating
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error updating coins:', error);
        alert('Error updating coins');
      });
  };

  // const handleDeleteUser = () => {
  //   if (!usernameToDelete) {
  //     alert('Please enter a username to delete');
  //     return;
  //   }

  //   axios.post('http://localhost:5000/api/admin/deleteUser', {
  //     username: usernameToDelete
  //   })
  //     .then((response) => {
  //       if (response.data.success) {
  //         alert('User deleted successfully!');
  //         // Remove user from the frontend list
  //         setUsers(users.filter(user => user.username !== usernameToDelete));
  //         setUsernameToDelete(''); // Clear the input after deletion
  //       } else {
  //         alert(response.data.message);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error deleting user:', error);
  //       alert('Error deleting user');
  //     });
  // };




  // Handle new shop data changes
  const handleShopChange = (field, value) => {
    setNewShop({ ...newShop, [field]: value });
  };

  // Save new shop to the backend
  const addShop = () => {
    if (!newShop.shopName || !newShop.shopOwner) {
      alert('Please enter both shop name and shop owner.');
      return;
    }

    axios.post('http://localhost:5000/api/admin/addShop', newShop)
      .then(response => {
        if (response.data.success) {
          alert('Shop added successfully!');
          setShops([...shops, newShop]);
          setNewShop({ shopName: '', shopOwner: '' }); // Clear input fields
        } else {
          alert('Failed to add shop');
        }
      })
      .catch(error => {
        console.error('Error adding shop:', error);
        alert('Error adding shop');
      });
  };

  const addProduct = () => {
    if (!newProduct.productName || !newProduct.price || !newProduct.quantity) {
      alert('Please complete all product fields.');
      return;
    }

    axios.post('http://localhost:5000/api/admin/addProduct', { shopName: selectedShop, ...newProduct })
      .then(response => {
        if (response.data.success) {
          alert('Product added successfully!');
          setProducts([...products, newProduct]);
          setNewProduct({ productName: '', price: '', quantity: '' });
        }
      });
  };


  // Function to delete a product
  const deleteProduct = (productName) => {
    if (!selectedShop) {
      alert('Please select a shop first.');
      return;
    }

    console.log("Attempting to delete product:", { shopName: selectedShop, productName }); // Log data

    axios.post('http://localhost:5000/api/admin/deleteProduct', { shopName: selectedShop, productName })
      .then(response => {
        if (response.data.success) {
          alert('Product deleted successfully!');
          setProducts(products.filter(product => product.productName !== productName));
        } else {
          alert(response.data.message || 'Failed to delete product');
        }
      })
      .catch(error => {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      });
  };

  const handleShopSelect = (shop) => {
    setSelectedShop(shop);
    axios.post('http://localhost:5000/api/admin/getProducts', { shopName: shop })
      .then(response => {
        if (response.data.success) setProducts(response.data.products);
      });
  };




  return (
    <div className='flex justify-around pt-11'>
      <div>
        <h1 className='text-3xl font-bold text-blue-900 p-2 pl-60'>Admin Panel</h1>
        {/* Search input for filtering users by userId */}
        <div className='p-2 pl-10'>
          <input className='p-3 rounded-lg  font-semibold text-blue-800 outline outline-blue-500'
            type="text"
            placeholder="Search user by 12-digit userId"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} /></div>

        {/* <h2>Update Coins</h2> */}
        <div className='p-5'>
          <table>
            <thead>
              <tr>
                <th className='text-blue-900 pr-16'>Username</th>
                <th className='text-blue-900'>User ID</th>
                <th className='text-blue-900 pl-12'>Current Balance</th>
                <th className='text-blue-900 pl-4'>Add Balance</th>
                <th className='text-blue-900 pl-4'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.username} style={{ backgroundColor: user.userId === searchTerm ? '#e0f7fa' : 'transparent' }}>
                  <td>{user.username}</td>
                  <td>{user.userId}</td>
                  <td className='pl-20'>{user.coins}</td>
                  <td className='pl-5'>
                    <input className='p-1 w-20 rounded outline outline-blue-500 font-semibold text-blue-800'
                      type="text"
                      value={newCoins[user.username] || ''}
                      onChange={(event) => handleCoinChange(user.username, event)} />
                  </td>
                  <td className='pl-6'>
                    <button className='rounded p-3 outline-blue-800 bg-blue-400 hover:bg-blue-500' onClick={() => saveCoins(user.username)}>Add</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className=''>

        <p className='text-3xl font-bold text-blue-900 p-2 pl-36'> Shop Management Section</p>
        <h2 className='p-5 text-blue-900 font-bold text-2xl'>Add & Manage Shops</h2>
        <div className='p-5 space-x-5'>
          <input className='p-2 rounded outline outline-blue-800 text-blue-900 font-semibold'
            type="text"
            placeholder="Shop Name"
            value={newShop.shopName}
            onChange={(e) => handleShopChange('shopName', e.target.value)} />
          <input className='p-2 rounded outline outline-blue-800 text-blue-900 font-semibold'
            type="text"
            placeholder="Shop Owner"
            value={newShop.shopOwner}
            onChange={(e) => handleShopChange('shopOwner', e.target.value)} />
          <button className='p-2 outline outline-blue-900 rounded bg-blue-200 font-semibold text-blue-900 hover:bg-blue-300' onClick={addShop}>Add Shop</button>
        </div>


        {/* Shop Selection */}
        <h2 className='pl-5 p-3 text-blue-900 font-bold text-2xl'>Add Shop Products</h2>
        <div className='pl-5 p-3'>
          <select className='p-3 pl-2 pr-2 rounded-lg text-blue-900 font-bold text-1xl outline outline-blue-900' onChange={(e) => handleShopSelect(e.target.value)} value={selectedShop || ''}>
            <option value="" disabled>Select shop</option>
            {shops.map(shop => <option className='text-blue-900 font-semibold' key={shop.shopName} value={shop.shopName}>{shop.shopName}</option>)}
          </select>
        </div>

        {/* Product Management for Selected Shop */}
        {selectedShop && (
          <div>
            <div className=''>
              <h2 className='pl-5 p-3 text-blue-900 font-bold text-2xl'>Products in<p className='text-blue-500'>{selectedShop}</p></h2>
            </div>
            <table>
              <thead>
                <tr>
                  <th className='pl-5'>Product Name</th>
                  <th className='pl-10'>Price</th>
                  <th className='pl-10'>Quantity</th>
                  {/* <th className='pl-10'>Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.productName}>
                    <td className='pl-14 pt-2 text-blue-900 font-semibold'>{product.productName}</td>
                    <td className='pl-12 pt-2 text-blue-900 font-semibold'>{product.price}</td>
                    <td className='pl-16 pt-2 text-blue-900 font-semibold'>{product.quantity}</td>
                    <td className='pl-9 pb-2 pt-2'>
                      <button className='p-1 outline outline-blue-900 rounded-sm bg-blue-200 hover:last:bg-blue-300' onClick={() => deleteProduct(product.productName)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Add New Product */}
            <h3 className='pl-5 p-3 text-blue-900 font-bold text-2xl'>Add New Product</h3>
            <div className='pl-5'>
              <div className='flex justify-between p-2'>
                <input className='p-3 rounded outline outline-blue-700'
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.productName}
                  onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })} />
                <input className='p-3 rounded outline outline-blue-700'
                  type="text"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
              </div>
              <div className=' flex p-2 space-x-36'>
                <input className='p-3 rounded outline outline-blue-700'
                  type="text"
                  placeholder="Quantity"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })} />
                <button className='outline rounded outline-blue-700 p-2 bg-blue-200 hover:bg-blue-300' onClick={addProduct}>Add Product</button>
              </div>
            </div>
          </div>

        )}
      </div>
    </div>
  );
};

export default AdminPanel;