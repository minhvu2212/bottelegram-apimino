const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');
const TOKEN = '7033297550:AAFlOvttWqse1k85lwX0IFkfKeXYm7llm9Q';
const API_TOKEN = 'cS0VuiPlLH5mt69TEAAgyAWe2CmNrN9G';
const HOST_URL = 'https://apptanglike.com/api/v1';
const bot = new TelegramBot(TOKEN, { polling: true });

function createOrder(serverId, postLink, numberSeeding) {
  const url = `${HOST_URL}/order/create`;
  const headers = { 'Accept': 'application/json' };
  const payload = {
    api_token: API_TOKEN,
    server_id: serverId,
    post_link: postLink,
    number_seeding: numberSeeding,
  };

  return axios.post(url, payload, { headers: headers })
    .then(response => {
      const orderData = response.data;
      // Ghi dữ liệu vào file data.txt
      fs.appendFile('data.txt', JSON.stringify(orderData) + '\n', (err) => {
        if (err) {
          console.error('Error writing to data.txt:', err);
        } else {
          console.log('Order data written to data.txt');
        }
      });
      return orderData;
    })
    .catch(error => {
      console.error('Error creating order:', error);
      throw error;
    });
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const options = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: 'Server 895: Tăng view telegram, min 100 1.5 đ', callback_data: '895' },
          { text: 'Server 458: Tăng view telegram, min 100 1.5 đ', callback_data: '458' }
        ],
        [
          { text: 'Server 846: Tăng view telegram, min 1k 1 đ', callback_data: '846' },
          { text: 'Server 840: Tăng view telegram, min 100 1 đ', callback_data: '840' }
        ]
      ]
    })
  };
  bot.sendMessage(chatId, 'Vui lòng chọn server:', options);
});

bot.on('callback_query', (callbackQuery) => {
  const message = callbackQuery.message;
  const chatId = message.chat.id;
  const serverId = callbackQuery.data;

  bot.sendMessage(chatId, `Bạn đã chọn server ${serverId}. Vui lòng gửi link cần tăng view.`);
  bot.answerCallbackQuery(callbackQuery.id)
    .then(() => {
      bot.once('message', (msg) => {
        if (msg.text && !msg.text.startsWith('/')) {
          const postLink = msg.text;
          bot.sendMessage(chatId, 'Vui lòng nhập số lượng seeding mong muốn:');
          bot.once('message', (msg) => {
            if (!isNaN(msg.text)) {
              const numberSeeding = parseInt(msg.text);
              createOrder(serverId, postLink, numberSeeding)
                .then(() => {
                  bot.sendMessage(chatId, 'Đơn đặt hàng của bạn đã được tạo thành công!');
                })
                .catch(error => {
                  bot.sendMessage(chatId, 'Đã xảy ra lỗi khi tạo đơn đặt hàng. Vui lòng thử lại sau.');
                });
            } else {
              bot.sendMessage(chatId, 'Số lượng seeding không hợp lệ. Vui lòng thử lại.');
            }
          });
        }
      });
    });
});
