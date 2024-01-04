const express = require('express');
const fs = require('fs');
const cors=require("cors")
const app = express();
const PORT = 8000; // Choose your desired port number

app.use(cors())
// Read the stock data from the file or initialize if the file doesn't exist
const stockDataFile = 'stock_data.json';
let stockData = {};

if (fs.existsSync(stockDataFile)) {
  const data = fs.readFileSync(stockDataFile, 'utf8');
  stockData = JSON.parse(data);
} else {
  // Sample stock data with refreshInterval
  stockData = {
    AAPL: { price: 150.23, refreshInterval: getRandomInt(1, 5) },
    GOOGL: { price: 2800.45, refreshInterval: getRandomInt(1, 5) },
    MSFT: { price: 305.67, refreshInterval: getRandomInt(1, 5) },
    AMZN: { price: 3200.11, refreshInterval: getRandomInt(1, 5) },
    TSLA: { price: 950.76, refreshInterval: getRandomInt(1, 5) }
    // Other stock tickers and prices...
  };
  saveStockData(stockData); // Save the initial data to file
}

// Update stock prices at their own intervals
for (const ticker in stockData) {
  const interval = stockData[ticker].refreshInterval;
  setInterval(updateStockPrice, interval * 1000, ticker);
}

// Define API endpoint to fetch stock data by ticker dynamically
app.get('/stock/:ticker', (req, res) => {
  const { ticker } = req.params;
  const stock = stockData[ticker];

  if (stock) {
    res.json({ ticker, price: stock.price, refreshInterval: stock.refreshInterval });
  } else {
    res.status(404).json({ error: 'Stock ticker not found' });
  }
});
// ... (Your existing code for server setup and stock data initialization)

// Function to update stock prices
function updateAllStockPrices() {
  for (const ticker in stockData) {
    updateStockPrice(ticker);
  }
}

// Update stock prices at their own intervals
for (const ticker in stockData) {
  const interval = stockData[ticker].refreshInterval;
  setInterval(updateStockPrice, interval * 1000, ticker);
}

// Define API endpoint to fetch limited number of stocks
app.get('/stocks/:count', (req, res) => {
  const { count } = req.params;
  const limitedStocks = Object.keys(stockData).slice(0, count).map(ticker => ({
    ticker,
    price: stockData[ticker].price,
    refreshInterval: stockData[ticker].refreshInterval
  }));

  res.json({ stocks: limitedStocks });
});

// Start updating all stock prices at their intervals
setInterval(updateAllStockPrices, 1000); // Update all prices every second


app.get('/stocks/:count', (req, res) => {
  const { count } = req.params;
  const limitedStocks = Object.keys(stockData).slice(0, count).map(ticker => ({
    ticker,
    price: stockData[ticker].price,
    refreshInterval: stockData[ticker].refreshInterval
  }));

  res.json({ stocks: limitedStocks });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Helper function to save stock data to the file
function saveStockData(data) {
  fs.writeFileSync(stockDataFile, JSON.stringify(data, null, 2));
}

// Helper function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to update stock price
function updateStockPrice(ticker) {
  const currentPrice = stockData[ticker].price;
  const newPrice = currentPrice * (1 + getRandomInt(-5, 5) / 100); // Simulating price change
  stockData[ticker].price = newPrice.toFixed(2); // Rounding to 2 decimal places
  saveStockData(stockData); // Save updated price to file
}
