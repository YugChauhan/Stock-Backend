const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 5000; // Choose a port for your server

// Middleware to parse JSON requests
app.use(express.json());

// Endpoint to fetch stock data
app.get('/stocks', async (req, res) => {
  try {
    const rawData = await fs.promises.readFile('stock_data.json');
    const stocksData = JSON.parse(rawData);
    res.json(stocksData.map(({ symbol, openPrice }) => ({ symbol, openPrice })));
  } catch (error) {
    console.error('Error reading file:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
