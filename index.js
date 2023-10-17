const { Telegraf, Markup } = require('telegraf')
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN)

let mainResult = []

bot.command('start', (ctx) => {
    ctx.reply('Привет! Укажи через «-» вес и кол-во раз, которое ты можешь сделать')
    // {
    //     reply_markup: Markup.inlineKeyboard([
    //         Markup.callbackButton('Кнопка 1', 'one')
    //     ])
    // }
})

bot.command('help', (ctx) => {
    ctx.replyWithHTML('+79643844354 - <b>Тинькофф</b>(Константин Т)')
})

// bot.action('one', (ctx) => {
//     ctx.reply('Вы нажали на 1-ю кнопку')
// })

bot.on('text', (ctx) => {
    const res = ctx.message.text.split('-')
    console.log(res)
    if(res.length < 2){
        return
    }
    mainResult = res
    ctx.reply(`Ты жмешь ${res[0]}кг - ${res[1]} раз?`, {
        reply_markup: Markup.inlineKeyboard([
            Markup.callbackButton('Да, верно!', 'success'),
            Markup.callbackButton('Нет', 'error')
        ])
    })

    // ctx.reply('Как дела?', {
    //     reply_markup: Markup.keyboard([['Отлично', 'Плохо']])
    // })
})


bot.action('success', (ctx) => {
    if(mainResult.length == 0){
        ctx.reply('Укажи через «-» вес и кол-во раз, которое ты можешь сделать')
        return
    }
    const weight = mainResult[0]
    const repeats = mainResult[1]
    const total = (-1.89 ) + (1.16 * weight) + (1.68 * repeats)
    // где M-вес штанги, k-количество повторов с этим весом
    ctx.reply(`На раз ты пожмешь ${parseFloat(total).toFixed(1)}кг`)
    mainResult = []
})

bot.action('error', (ctx) => {
    ctx.reply('Укажи через «-» вес и кол-во раз, которое ты можешь сделать')
    mainResult = []
})



bot.launch()