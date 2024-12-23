// const express = require('express');
// const router = express.Router();
// const ExcelJS = require('exceljs');
// const path = require('path');
// const fs = require('fs');

// const filePath = path.join(__dirname, '../data/shops.xlsx');

// // Helper function to ensure the Excel file exists
// const ensureExcelFileExists = async () => {
//   if (!fs.existsSync(filePath)) {
//     const workbook = new ExcelJS.Workbook();
//     await workbook.xlsx.writeFile(filePath);
//   }
// };

// // Route to add a new shop
// router.post('/add-shop', async (req, res) => {
//   const { shopName, products } = req.body;

//   if (!shopName) {
//     return res.status(400).json({ message: 'Shop name is required' });
//   }

//   try {
//     await ensureExcelFileExists();

//     const workbook = new ExcelJS.Workbook();
//     await workbook.xlsx.readFile(filePath);

//     // Check if a sheet with the shop name already exists
//     let shopSheet = workbook.getWorksheet(shopName);
//     if (!shopSheet) {
//       // Create a new sheet for the shop
//       shopSheet = workbook.addWorksheet(shopName);
//       shopSheet.columns = [
//         { header: 'Product Name', key: 'productName', width: 30 },
//         { header: 'Quantity', key: 'quantity', width: 15 },
//         { header: 'Price', key: 'price', width: 15 },
//       ];
//     }

//     // Add initial products if provided
//     if (products && Array.isArray(products)) {
//       products.forEach(product => {
//         shopSheet.addRow({
//           productName: product.name,
//           quantity: product.quantity || 0,
//           price: product.price || 0,
//         });
//       });
//     }

//     // Save the workbook
//     await workbook.xlsx.writeFile(filePath);

//     res.json({ message: Shop "${shopName}" added successfully! });
//   } catch (error) {
//     console.error('Error adding shop:', error);
//     res.status(500).json({ message: 'Error adding shop' });
//   }
// });

// // Route to check if a shop exists
// router.get('/shop-exists/:shopName', async (req, res) => {
//   const { shopName } = req.params;

//   try {
//     await ensureExcelFileExists();

//     const workbook = new ExcelJS.Workbook();
//     await workbook.xlsx.readFile(filePath);

//     const shopSheet = workbook.getWorksheet(shopName);

//     if (shopSheet) {
//       res.json({ exists: true });
//     } else {
//       res.json({ exists: false });
//     }
//   } catch (error) {
//     console.error('Error checking shop existence:', error);
//     res.status(500).json({ message: 'Error checking shop' });
//   }
// });

// module.exports = router;