const key = "268b01a72755164d9511d58b6cca59c339df7892beafaf2673e5fbdc4770bd3b";

const tickersHandlers = new Map();

const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2&api_key=${key}`);

// function ifSocketOpen() {
//     console.log('ifOpen ', socket.readyState);

//     const subArr = [...tickersHandlers.keys()].map(ticker => `5~CCCAGG~${ticker}~USD`);
//     console.log(subArr);


//     socket.send(JSON.stringify({
//         "action": "SubAdd",
//         "subs": subArr,
//     }));
// }

socket.onmessage = function (e) {
    const {
        TYPE: type,
        FROMSYMBOL: currency,
        PRICE: newPrice
    } = JSON.parse(e.data)
    const type_message = '5';
    if (type === type_message && newPrice) {
        const handlers = tickersHandlers.get(currency) || [];
        handlers.forEach(fn => {
            fn(newPrice);
        })
    }
};

// const loadTickers = () => {

//     if (tickersHandlers.size === 0) return false;
//     fetch(
//             `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...tickersHandlers.keys()].join(',')}&api_key=${key}&tsyms=USD`
//         ).then(resp => resp.json())
//         .then(rawData => {
//             const updatePrices = Object.entries(rawData).map(([key, value]) => [key, value.USD]);

//             updatePrices.forEach(([currency, newPrice]) => {
//                 const handlers = tickersHandlers.get(currency) || [];
//                 handlers.forEach(fn => {
//                     // console.log('currency ', currency);
//                     fn(newPrice);
//                 })
//             })
//         });

// }

function sendToWS(message) {
    const stringifiedMessage = JSON.stringify(message);
    if (socket.readyState == 1) socket.send(stringifiedMessage);

    socket.addEventListener('open', () => {
        socket.send(stringifiedMessage)
    }, {
        once: true
    })
}

function subscribeTickerWS(tickerName) {
    sendToWS({
        "action": "SubAdd",
        "subs": [`5~CCCAGG~${tickerName}~USD`],
    });
}

function unsubscribeTickerWS(tickerName) {
    sendToWS({
        "action": "SubRemove",
        "subs": [`5~CCCAGG~${tickerName}~USD`],
    });
}
export const subscribeToTicker = (ticker, cb) => {
    const subscribes = tickersHandlers.get(ticker) || [];
    tickersHandlers.set(ticker, [...subscribes, cb]);
    subscribeTickerWS(ticker)
    // loadTickersFromWS()
}

export const unscribeFromTicker = (ticker) => {
    tickersHandlers.delete(ticker)
    unsubscribeTickerWS(ticker)
    // const subscribes = tickersHandlers.get(ticker) || [];
    // tickersHandlers.set(ticker,
    //     subscribes.filter(fn => fn !== cb)
    // );
};

// setInterval(loadTickers, 5000);

window.tickers = tickersHandlers;