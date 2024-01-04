const axios = require('axios');
const fs = require('fs');

const API_KEY = '5p7XwGZZoCUjg2JCKWrjByumdrOfKAIo'; // Replace with your Polygon API key
const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NFLX', 'FB', 'NVDA', 'INTC', 'AMD', 'CSCO', 'PYPL', 'ADBE', 'QCOM', 'IBM', 'SNAP', 'TWTR', 'UBER', 'LYFT', 'EBAY'];

// Function to generate a random refresh interval between 1 and 5 seconds
function getRandomRefreshInterval() {
  return Math.floor(Math.random() * 5) + 1;
}

// Function to generate a random price change (-5% to +5% of the current price)
function generateRandomChange(currentPrice) {
  const changePercent = (Math.random() - 0.5) * 0.1; // Random value between -0.05 and +0.05
  return currentPrice * (1 + changePercent);
}

// Function to fetch stock data from Polygon API for a single symbol
async function fetchStock(symbol) {
  try {
    const response = await axios.get(`https://api.polygon.io/v1/open-close/${symbol}/2024-01-01?apiKey=${API_KEY}`);
    const openPrice = response.data.open;
    const refreshInterval = getRandomRefreshInterval();
    return { symbol, openPrice, refreshInterval };
  } catch (error) {
    console.error(`Error fetching data for ${symbol}: ${error.message}`);
    return { symbol, openPrice: null, refreshInterval: getRandomRefreshInterval() };
  }
}

// Function to update stock prices randomly at their refresh intervals
async function updateStockPrices(stockData) {
  for (const stock of stockData) {
    setInterval(() => {
      const updatedPrice = generateRandomChange(stock.openPrice);
      console.log(`Updated ${stock.symbol} price: ${updatedPrice.toFixed(2)}`);
      stock.openPrice = updatedPrice;
    }, stock.refreshInterval * 1000);
  }
}

// Function to fetch data for multiple stocks, manage intervals, and store in a file
async function fetchDataAndStore() {
  const stocksData = [];

  for (const symbol of symbols) {
    const stockInfo = await fetchStock(symbol);
    stocksData.push(stockInfo);
  }

  // Update prices and store data in a file
  updateStockPrices(stocksData);
  try {
    await fs.promises.writeFile('stock_data.json', JSON.stringify(stocksData, null, 2));
    console.log('Stock data has been stored in stock_data.json');
  } catch (error) {
    console.error('Error writing to file:', error.message);
  }
}

// Call the function to start fetching data, managing intervals, and updating prices
fetchDataAndStore();
