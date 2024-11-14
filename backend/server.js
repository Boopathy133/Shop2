const express = require('express');
const xlsx = require('xlsx');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const router = express.Router();  // Initialize router

app.use(cors());
app.use(express.json());

// Path to user data Excel file
const EXCEL_PATH = path.join(__dirname, 'data', 'student-database.xlsx');

// Path to the products list Excel file
const PRODUCT_FILE_PATH = path.join(__dirname, 'data', 'productsList.xlsx');
console.log("Resolved path:", PRODUCT_FILE_PATH);

// Endpoint to load user data from Excel
app.get('/api/admin/getUsers', (req, res) => {
  try {
    if (!fs.existsSync(EXCEL_PATH)) {
      return res.status(500).json({ success: false, message: 'Excel file not found' });
    }

    const workbook = xlsx.readFile(EXCEL_PATH);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const users = xlsx.utils.sheet_to_json(worksheet);
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load users' });
  }
});

// Endpoint to update user coins
app.post('/api/admin/updateUserCoins', (req, res) => {
  const { username, newCoins } = req.body;

  try {
    const workbook = xlsx.readFile(EXCEL_PATH);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const users = xlsx.utils.sheet_to_json(worksheet);

    const userIndex = users.findIndex((user) => user.username === username);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    users[userIndex].coins = (users[userIndex].coins || 0) + newCoins;

    const newWorksheet = xlsx.utils.json_to_sheet(users);
    workbook.Sheets[workbook.SheetNames[0]] = newWorksheet;
    xlsx.writeFile(workbook, EXCEL_PATH);
    res.json({ success: true, message: 'Coins updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update coins' });
  }
});

// Endpoint to get shops from Excel
router.get('/getShops', (req, res) => {
  try {
    const workbook = xlsx.readFile(PRODUCT_FILE_PATH);
    const shopSheet = workbook.Sheets[workbook.SheetNames[0]];
    const shops = xlsx.utils.sheet_to_json(shopSheet);
    res.json({ success: true, shops });
  } catch (error) {
    console.error('Error loading shops:', error);
    res.json({ success: false, message: 'Failed to load shops' });
  }
});

// Endpoint to add a shop to Excel
router.post('/addShop', (req, res) => {
  const { shopName, shopOwner } = req.body;

  try {
    const workbook = xlsx.readFile(PRODUCT_FILE_PATH);
    const shopSheet = workbook.Sheets[workbook.SheetNames[0]];
    const shops = xlsx.utils.sheet_to_json(shopSheet);

    // Append the new shop
    shops.push({ shopName, shopOwner });
    const updatedShopSheet = xlsx.utils.json_to_sheet(shops);
    workbook.Sheets[workbook.SheetNames[0]] = updatedShopSheet;

    // Write updated data back to file
    xlsx.writeFile(workbook, PRODUCT_FILE_PATH);
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding shop:', error);
    res.json({ success: false, message: 'Failed to add shop' });
  }
});

// Endpoint to fetch products for a specific shop
router.post('/getProducts', (req, res) => {
  const { shopName } = req.body;
  try {
    const workbook = xlsx.readFile(PRODUCT_FILE_PATH);
    const shopSheet = workbook.Sheets[shopName];
    if (!shopSheet) return res.json({ success: true, products: [] });

    const products = xlsx.utils.sheet_to_json(shopSheet);
    res.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.json({ success: false, message: 'Failed to load products' });
  }
});

// Endpoint to add a new product to a shop
router.post('/addProduct', (req, res) => {
  const { shopName, productName, price, quantity } = req.body;

  if (!shopName || !productName || !price || !quantity) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
    // console.log("Saving file to:", PRODUCT_FILE_PATH);
  }

  try {
    let workbook;
    if (fs.existsSync(PRODUCT_FILE_PATH)) {
      workbook = xlsx.readFile(PRODUCT_FILE_PATH);
    } else {
      workbook = xlsx.utils.book_new();
    }

    // Check if there is a sheet for the shop; if not, create one
    let worksheet = workbook.Sheets[shopName];
    if (!worksheet) {
      worksheet = xlsx.utils.json_to_sheet([]);
      xlsx.utils.book_append_sheet(workbook, worksheet, shopName);
    }

    // Convert worksheet to JSON, add the new product, and write back to sheet
    const products = xlsx.utils.sheet_to_json(worksheet);
    products.push({ productName, price: parseFloat(price), quantity: parseInt(quantity) });

    // Convert updated products array back to worksheet
    const updatedWorksheet = xlsx.utils.json_to_sheet(products);
    workbook.Sheets[shopName] = updatedWorksheet;

    // Save the updated workbook
    xlsx.writeFile(workbook, PRODUCT_FILE_PATH);

    res.json({ success: true, message: 'Product added successfully!' });
  } catch (error) {
    console.error('Error adding product:', error);
    res.json({ success: false, message: 'Failed to add product' });
  }
});

// To delete products from specific shop
router.post('/deleteProduct', (req, res) => {
  const { shopName, productName } = req.body;

  // console.log("Received delete request for:", { shopName, productName }); // Log request data

  if (!shopName || !productName) {
    console.log("Missing shop name or product name"); // Additional log for missing data
    return res.status(400).json({ success: false, message: 'Shop name and product name are required.' });
  }

  try {
    const workbook = xlsx.readFile(PRODUCT_FILE_PATH);
    const shopSheet = workbook.Sheets[shopName];

    if (!shopSheet) {
      console.log("Shop not found:", shopName); // Log if shop not found
      return res.status(404).json({ success: false, message: 'Shop not found.' });
    }

    let products = xlsx.utils.sheet_to_json(shopSheet);
    // console.log("Current products in shop:", products); // Log current products

    // Filter out the product to delete
    const updatedProducts = products.filter(product => product.productName !== productName);

    if (updatedProducts.length === products.length) {
      console.log("Product not found:", productName); // Log if product not found
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Update the sheet with remaining products
    const updatedShopSheet = xlsx.utils.json_to_sheet(updatedProducts);
    workbook.Sheets[shopName] = updatedShopSheet;

    // Save the workbook
    xlsx.writeFile(workbook, PRODUCT_FILE_PATH);

    // console.log("Product deleted successfully"); // Confirm deletion
    res.json({ success: true, message: 'Product deleted successfully!' });
  } catch (error) {
    // console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
});


// Register router and start the server
app.use('/api/admin', router);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});