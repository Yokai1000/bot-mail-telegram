const TelegramBot = require("node-telegram-bot-api");
const TempMail = require("node-temp-mail");
const { v4: uuidv4 } = require("uuid");
const token = process.env.TOKEN;

let account;
let address;
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

let isEmailCreated = false;
// Matches "/echo [whatever]"
bot.onText(/\/generate/, (msg) => {
  const chatId = msg.chat.id;
  const uuid = uuidv4();
  account = new TempMail(uuid);

  console.log(address);
  isEmailCreated = true;

  bot.sendMessage(
    chatId,
    `Temporary email created : ${account.getAddress().address}`
  );
  // send back the matched "whatever" to the chat
  // bot.sendMessage(chatId, ` For retrivied messages type /retrieve,`);
});

bot.onText(/\/retrieve/, (msg) => {
  const chatId = msg.chat.id;

  if (isEmailCreated) {
    account.fetchEmails(function (err, body) {
      console.log(body);
      bot.sendMessage(
        chatId,
        `Mail content : ${JSON.stringify(body.messages)}`
      );
    });
  }
});

bot.on("polling_error", console.log);
