const request = require('request');

const parseJSON = (data) => {
  try {
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
};

const formatValue = (value, currencySymbol) => {
  const parsedValue = (isNaN(value)) ? 0 : parseFloat(value, 10);

  return `${currencySymbol} ${parsedValue.toFixed(2)}`;
};

const doRequest = (url, dataResolver) => {
  const promiseCallback = (resolve, reject) => {
    const callback = (error, httpResponse, body) => {
      if (error) return reject(error);
      const response = parseJSON(body);
      const price = (response) ? dataResolver(response) : null;
      resolve(price);
    };
    request(url, callback);
  }

  return new Promise(promiseCallback);
};

const getPriceCoinbase = () => {
  const url = 'https://api.coinbase.com/v2/prices/spot?currency=USD';
  const dataResolver = (response) => formatValue(response.data.amount, 'U$');
  return doRequest(url, dataResolver);
};

const getPriceBitcoinTrade = () => {
  const url = 'https://api.bitcointrade.com.br/v2/public/BRLBTC/ticker';
  const dataResolver = (response) => formatValue(response.data.last, 'R$');
  return doRequest(url, dataResolver);
};

(async () => {
  const [priceBitcoinTrade, priceCoinbase] = await Promise.all([
    getPriceBitcoinTrade(),
    getPriceCoinbase(),
  ]);
  const text = `${priceBitcoinTrade} | ${priceCoinbase}`;
  console.log(text);
})();


