const express = require('express');
const xlsx = require('xlsx');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const excel = require('exceljs');
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
































// For Dashboard
// Path to the workbook
const filePath = path.join(
  __dirname,
  "data",
  "productsList.xlsx"
); // Ensure this file exists at this location.

// Endpoint to fetch all shops
app.get("/shops", (req, res) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const shopsSheet = workbook.Sheets["shops"]; // Shops are stored in the "shops" sheet
    if (!shopsSheet) {
      return res.status(404).json({ error: "Shops sheet not found in workbook." });
    }

    const shops = xlsx.utils.sheet_to_json(shopsSheet); // Parse the shops
    res.json(shops);
  } catch (error) {
    console.error("Error reading shops:", error.message);
    res.status(500).json({ error: "Failed to fetch shops from the Excel file." });
  }
});

// Endpoint to fetch products for a specific shop
app.get("/products/:shopName", (req, res) => {
  const { shopName } = req.params;

  try {
    const workbook = xlsx.readFile(PRODUCT_FILE_PATH);
    const shopSheet = workbook.Sheets[shopName];

    if (!shopSheet) {
      // Return empty array if the sheet for the shop doesn't exist
      return res.json([]);
    }

    const products = xlsx.utils.sheet_to_json(shopSheet);
    res.json(products);
  } catch (error) {
    console.error(`Error fetching products for shop ${shopName}:`, error.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});







app.post('/getUserData/:userID', async (req, res) => {
  const { userID } = req.params;
  // console.log('Requested userID:', userID);

  const workbook = new excel.Workbook();
  try {
    await workbook.xlsx.readFile('E:\\Canteen Projects\\Under_Integration\\Shop\\backend\\usersData.xlsx');
    const worksheet = workbook.getWorksheet(1); // Assuming user data is in the first sheet

    let userFound = false;
    let username = '';
    let storedPassword = '';

    worksheet.eachRow((row, rowNumber) => { // Add rowNumber as the second argument
      const cellUserID = row.getCell(1).value; // userID is in the first column
      // console.log(`Row ${rowNumber}: userID = ${cellUserID}`);
      if (cellUserID && cellUserID.toString() === userID) { // Ensure cellUserID is not null
        userFound = true;
        username = row.getCell(2).value; // username is in the second column
        storedPassword = row.getCell(3).value; // password is in the third column
      }
    });

    if (userFound) {
      res.json({ username, password: storedPassword });
    } else {
      res.status(404).json({ message: 'User ID not found' });
    }
  } catch (error) {
    console.error('Error reading Excel file:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});



// Endpoint to set user password
// Endpoint to set user password
app.post('/setPassword/:userID', async (req, res) => {
  const { userID } = req.params;
  const { password } = req.body; // Password entered by the user

  // console.log('Requested userID:', userID);
  // console.log('Password to set:', password);

  const workbook = new excel.Workbook();
  try {
    await workbook.xlsx.readFile('E:\\Canteen Projects\\Under_Integration\\Shop\\backend\\usersData.xlsx');
    const worksheet = workbook.getWorksheet(1); // Assuming user data is in the first sheet

    let userFound = false;

    worksheet.eachRow((row, rowNumber) => {
      const cellUserID = row.getCell(1).value; // userID is in the first column
      console.log(`Row ${rowNumber} userID: ${cellUserID}, Search userID: ${userID}`);
      if (cellUserID.toString() === userID) { // Use toString() to handle different formats
        userFound = true;
        row.getCell(3).value = password; // Set the password in the third column
        console.log(`Password set for userID ${userID}`);
      }
    });

    if (userFound) {
      try {
        await workbook.xlsx.writeFile('E:\\Canteen Projects\\Under_Integration\\Shop\\backend\\usersData.xlsx');
        alert('Password updated successfully!');
        res.json({ message: 'Password set successfully' });
      } catch (writeError) {
        console.error('Error writing to Excel file:', writeError);
        res.status(500).json({ message: 'Error writing to Excel file' });
      }
    } else {
      res.status(404).json({ message: 'User ID not found' });
    }

  } catch (error) {
    console.error('Error reading Excel file:', error);
    res.status(500).json({ message: 'Error setting password' });
  }
});


// Endpoint to validate the user password on login
app.post('/validatePassword/:userID', async (req, res) => {
  const { userID } = req.params;
  const { password } = req.body; // Password entered by the user

  const workbook = new excel.Workbook();
  try {
    await workbook.xlsx.readFile('E:\\Canteen Projects\\Under_Integration\\Shop\\backend\\usersData.xlsx');
    const worksheet = workbook.getWorksheet(1); // Assuming user data is in the first sheet

    let userFound = false;
    let storedPassword = '';

    worksheet.eachRow((row) => {
      const cellUserID = row.getCell(1).value; // userID is in the first column
      if (cellUserID.toString() === userID) { // Use toString() to handle different formats
        userFound = true;
        storedPassword = row.getCell(3).value; // password is in the third column
      }
    });

    if (userFound && storedPassword === password) {
      res.json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid password' });
    }
  } catch (error) {
    console.error('Error validating password:', error);
    res.status(500).json({ message: 'Error validating password' });
  }
});


// For dashboard username
app.post('/api/login', async (req, res) => {
    const { userID, password } = req.body;

    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const sheet = workbook.getWorksheet(1); // Assuming user data is on the first sheet

        let validUser = null;

        sheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) { // Skip header row
                const id = row.getCell(1).value; // Assuming first column is userID
                const pass = row.getCell(3).value; // Assuming third column is password

                if (id === userID && pass === password) {
                    validUser = { userID: id };
                }
            }
        });

        if (validUser) {
            res.json(validUser);
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});









































// Register router and start the server
app.use('/api/admin', router);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});