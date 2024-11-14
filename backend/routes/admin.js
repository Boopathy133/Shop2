// backend/routes/admin.js
app.post('/admin/update-coins', async (req, res) => {
    const { username, amountInRupees } = req.body;
  
    // Conversion: 1 Rupee = 1 Coin
    const coinsToAdd = amountInRupees * 1;
  
    // Proceed with updating the Excel sheet (e.g., updating user coins)
    try {
      const user = findUserInExcel(username); // Fetch user from Excel sheet logic
      if (user) {
        user.coins = (user.coins || 0) + coinsToAdd;
        saveUserDataToExcel(user); // Your save function to write to Excel
        res.json({ success: true, message: "Coins updated successfully." });
      } else {
        res.status(404).json({ success: false, message: "User not found." });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Error updating coins.", error });
    }
  });