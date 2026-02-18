const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const express = require("express");

const token = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;
const CMC_API_KEY = process.env.CMC_API_KEY;

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("TON Bot is running ✅");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Web server running on port " + PORT);
});

let bot;

function startBot() {
  bot = new TelegramBot(token, { polling: true });

  bot.on("polling_error", (error) => {
    console.log("Polling error:", error.code);
  });

  console.log("Telegram bot started");
}

startBot();

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection:", err);
});

async function sendTONPrice() {
