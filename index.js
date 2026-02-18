const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const token = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;
const CMC_API_KEY = process.env.CMC_API_KEY;

const bot = new TelegramBot(token, { polling: true });

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection:", err);
});

async function sendTONPrice() {
  try {
    const cmcResp = await axios.get(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest",
      {
        params: { symbol: "TON", convert: "USD" },
        headers: { "X-CMC_PRO_API_KEY": CMC_API_KEY },
        timeout: 10000
      }
    );

    const cmcData = cmcResp.data.data.TON.quote.USD;

    const price = Number(cmcData.price).toFixed(5);
    const change = Number(cmcData.percent_change_24h).toFixed(2);
    const sign = change >= 0 ? "+" : "";

    const cgResp = await axios.get(
      "https://api.coingecko.com/api/v3/coins/the-open-network",
      { timeout: 10000 }
    );

    const market = cgResp.data.market_data;

    const high = Number(market.high_24h.usd).toFixed(2);
    const low = Number(market.low_24h.usd).toFixed(2);

    const message =
`💎 <b>TON/USDT PRICE</b>

💰 <b>Price:</b> <code>${price}$ (${sign}${change}%)</code>

🟢 <b>High Price (24H):</b> <code>${high}$</code>

🔴 <b>Low Price (24H):</b> <code>${low}$</code>`;

    await bot.sendMessage(chatId, message, { parse_mode: "HTML" });

    console.log("Message sent successfully");

  } catch (error) {
    console.log("API Error:", error.message);
  }
}

sendTONPrice();
setInterval(sendTONPrice, 300000);
