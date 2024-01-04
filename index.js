const express = require('express');
const fs = require('fs');

const app = express();

// Fetching stock data from the stored file
app.get('/stocks', (req, res) => {
  try {
    const stocksData = JSON.parse(fs.readFileSync('stocksData.json'));
    res.json(stocksData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

// Fetching stock price by symbol
app.get('/stocks/:symbol', (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  try {
    const stocksData = JSON.parse(fs.readFileSync('stocksData.json'));
    const stock = stocksData.find(stock => stock.symbol === symbol);
    if (!stock) {
      res.status(404).json({ error: 'Stock not found' });
    } else {
      res.json({ symbol: stock.symbol, openPrice: stock.openPrice });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock price' });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
