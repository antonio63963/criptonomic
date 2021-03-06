const key = "268b01a72755164d9511d58b6cca59c339df7892beafaf2673e5fbdc4770bd3b"

export const loadTicker = (tickers) =>
fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickers.join(',')}&api_key=${key}&tsyms=USD`
  ).then(resp => resp.json());