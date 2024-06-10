const { default: axios } = require('axios');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3003;

app.use(cors());

const getCryptoData = async () => {
  try {
    const response = await axios.get(
      'https://api.binance.com/api/v3/ticker/24hr'
    );
    const data = response.data;

    const shortData = data.sort(
      (a, b) =>
        parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent)
    );
    const topCryptos = shortData.slice(0, 10);
    const topCryptosInUSD = topCryptos.map((crypto) => ({
      ...crypto,
      priceInUSD: parseFloat(crypto.lastPrice),
    }));

    return topCryptosInUSD;
  } catch (error) {
    console.error('Error fetching crypto: ', error);
    return [];
  }
};

app.get('/api/cryptos/top', async (req, res) => {
  const data = await getCryptoData();
  res.json({
    total: data.length,
    data,
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
