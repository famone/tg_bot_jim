const { Telegraf, Markup } = require('telegraf')
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN)

let mainResult = []

// basic comands
bot.command('start', (ctx) => {
    ctx.reply('Привет! Укажи через «-» вес штанги и кол-во раз, которое ты можешь сделать стабильно')
})

bot.command('help', (ctx) => {
    ctx.replyWithHTML('+79643843454 - <b>Тинькофф</b>(Константин Т)')
})

// logic

bot.on('text', (ctx) => {
    const res = ctx.message.text.split('-')
    if(res.length < 2){
        return
    }
    const userInStore = mainResult.find(i => i.user_id === ctx.from.id)
    if(!userInStore){
        mainResult.push({user_id: ctx.from.id, val: res})
    }else{
        userInStore = {user_id: ctx.from.id, val: res}
    }

    ctx.reply(`Ты жмешь ${res[0]}кг - ${res[1]} раз?`, {
        reply_markup: Markup.inlineKeyboard([
            Markup.callbackButton('Да, верно!', 'success'),
            Markup.callbackButton('Нет', 'error')
        ])
    })
})


bot.action('success', (ctx) => {
    const savedInStore = mainResult.find((i) => i.user_id === ctx.from.id)
    console.log(savedInStore)
    if(!savedInStore){
        ctx.reply('Укажи через «-» вес штанги и кол-во раз, которое ты можешь сделать стабильно')
        return
    }else{
        const weight = savedInStore.val[0]
        const repeats = savedInStore.val[1]
        // const total = (-1.89 ) + (1.16 * weight) + (1.68 * repeats)
        
        const total = (weight * repeats * 0.0333) + parseInt(weight)
        const idx = mainResult.indexOf(savedInStore)

        ctx.replyWithPhoto({ source: parseFloat(total) > 100 ? 'cool.png' : 'low.png' }, { caption: `На раз ты пожмешь ${parseFloat(total).toFixed(1)}кг`})
        mainResult.splice(idx, 1)
    }
})

bot.action('error', (ctx) => {
    ctx.reply('Укажи через «-» вес штанги и кол-во раз, которое ты можешь сделать стабильно')
    mainResult = []
})

bot.launch()