const telegramBot = require('node-telegram-bot-api')
const token = '5933677846:AAG_zgCewJSJwGEBVdh9fgHJ0R4xkh2QT8k'

const bot = new telegramBot(token, { polling: true })
const chats = {}
bot.getMyCommands([
    {
        command: '/start',
        description: 'Bot ni ishga tushirish uchun',
    },
    {
        command: '/game',
        description: 'Botdagi o`yinni ni ishga tushirish uchun',
    },
    {
        command: '/info',
        description: 'foydalanuvchi haqida ma `lumot olish uchun',
    },
    {
        command: '/time',
        description: 'hozirgi vaqt',
    },
    {
        command: '/day',
        description: 'bugungu kun',
    },
])
const returnGame = {
    reply_markup: JSON.stringify({
        inline_keyboard: [[{ text: 'qayta o`ynash', callback_data: '/again' }]],
    }),
}
const gameButton = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [
                { text: '1', callback_data: '1' },
                { text: '2', callback_data: '2' },
                { text: '3', callback_data: '3' },
            ],
            [
                { text: '4', callback_data: '4' },
                { text: '5', callback_data: '5' },
                { text: '6', callback_data: '6' },
            ],
            [
                { text: '7', callback_data: '7' },
                { text: '8', callback_data: '8' },
                { text: '9', callback_data: '9' },
            ],
            [{ text: '0', callback_data: '0' }],
        ],
    }),
}
const startGame = async (chatId) => {
    await bot.sendMessage(
        chatId,
        `Я думал число от 0 до 9  `
    )
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    console.log(chats)
    await bot.sendMessage(chatId, 'найти', gameButton)
}
function start() {
    bot.on('message', async (msg) => {
        const text = msg.text
        const chatId = msg.chat.id
        if (text === '/start') {
            return (
                bot.sendMessage(
                    chatId,
                    `Привет пользователь, если вы хотите получить полную информацию о боте нажмите /help`
                ),
                await bot.sendSticker(
                    chatId,
                    'https://tlgrm.ru/_/stickers/ef5/8e1/ef58e15f-94a2-3d56-a365-ca06e1339d08/7.webp'
                ),
                await bot.sendAudio(chatId, './music/windows.mp3')
            )
        }
        if (text === '/info') {
            return (
                bot.sendMessage(
                    chatId,
                    `Ваше имя ${msg.from.first_name} ${msg.from.last_name}`
                ),
                await bot.sendVideo(
                    chatId,
                    'https://media.tenor.com/dp_hQBGT0rIAAAPo/think-smart.mp4'
                )
            )
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        if (text === '/time') {
            const date = new Date().toLocaleTimeString()
            return bot.sendMessage(chatId, `текущий час ${date}`)
        }
        if (text === '/help') {
            return bot.sendMessage(
                chatId,
                `Команда /info нужна для получения информации о пользователе.
                Команда /start перезапускает бота.
                /game для запуска игры на боте.
                Команда /time отображает текущее время.
                Команда /day отображает сегодняшний день.
`
            )
        }
        if (text === '/day') {
            const todayDate = new Date().toISOString().slice(0, 10)
            return bot.sendMessage(chatId, `сегодняшняя дата ${todayDate}`)
        }

        return (
            bot.sendMessage(chatId, 'я не понимаю вас :('),
            await bot.sendAudio(chatId, './music/error.mp3')
        )

    })
    bot.on('callback_query', async (msg) => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if (data === '/again') {
            return startGame(chatId)
        }
        if (data != chats[chatId]) {
            return bot.sendMessage(
                chatId,
                `жаль, что ты не смог найти ${chats[chatId]}`,
                returnGame
            )
        } else {
            return bot.sendMessage(
                chatId,
                `поздравляю ты нашел это ${chats[chatId]}`,
                returnGame
            )
        }
    })
}
start()
