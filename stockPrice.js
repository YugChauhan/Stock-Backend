const axios = require('axios');

const API_KEY = '5p7XwGZZoCUjg2JCKWrjByumdrOfKAIo';
const baseUrl = 'https://api.polygon.io';

async function getStocksList() {
  try {
    const response = await axios.get(`${baseUrl}/v2/snapshot/locale/us/markets/stocks/tickers?apiKey=${API_KEY}&limit=20`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stocks list:', error);
    throw error;
  }
}

async function getOpenPrice(ticker) {
  try {
    const response = await axios.get(`${baseUrl}/v1/open-close/${ticker}/2024-01-04?apiKey=${API_KEY}`);
    return response.data.preMarket;
  } catch (error) {
    console.error(`Error fetching open price for ${ticker}:`, error);
    throw error;
  }
}

async function getStocksWithOpenPrices() {
  try {
    const stocksList = await getStocksList();
    const stockTickers = stocksList.tickers.map(tickerData => tickerData.ticker);

    const openPricesPromises = stockTickers.map(ticker => getOpenPrice(ticker));
    const openPrices = await Promise.all(openPricesPromises);

    const stocksWithOpenPrices = stockTickers.reduce((result, ticker, index) => {
      result[ticker] = openPrices[index];
      return result;
    }, {});

    return stocksWithOpenPrices;
  } catch (error) {
    console.error('Error fetching stocks with open prices:', error);
    throw error;
  }
}

getStocksWithOpenPrices()
  .then(data => {
    console.log('Stocks with open prices:', data);
  })
  .catch(err => {
    console.error('Error:', err);
  });
