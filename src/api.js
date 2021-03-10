const key = "268b01a72755164d9511d58b6cca59c339df7892beafaf2673e5fbdc4770bd3b";

const tickersHandlers = new Map();

export const loadTickers = () => {
 
    if(tickersHandlers.size === 0) return false;
    fetch(
        `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...tickersHandlers.keys()].join(',')}&api_key=${key}&tsyms=USD`
    ).then(resp => resp.json())
    .then(rawData => {
        const updatePrices = Object.entries(rawData).map(([key, value]) => [key, value.USD]);

        updatePrices.forEach(([currency, newPrice]) => {
            const handlers = tickersHandlers.get(currency) || [];
            handlers.forEach(fn => {
                // console.log('currency ', currency);
                fn(newPrice);
            })
        })
    });

}
export const subscribeToTicker = (ticker, cb) => {
    const subscribes = tickersHandlers.get(ticker) || [];
    tickersHandlers.set(ticker, [...subscribes, cb]);
}

export const unscribeFromTicker = (ticker, cb) => {
    const subscribes = tickersHandlers.get(ticker) || [];
    tickersHandlers.set(ticker,
        subscribes.filter(fn => fn !== cb)
    );
};

setInterval(loadTickers, 5000);

window.tickers = tickersHandlers;