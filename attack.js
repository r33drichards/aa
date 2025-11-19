/*
 *
 * A bot that attacks the player that sends a message or the nearest entity (excluding players)
 *
 */
const mineflayer = require('mineflayer')
// import { loader as autoEat } from 'mineflayer-auto-eat'
const autoEat = require('mineflayer-auto-eat')
const mineflayerViewer = require('prismarine-viewer').mineflayer


const bot = mineflayer.createBot({
  host: 'centerbeam.proxy.rlwy.net',
  port: 40387,
  username: 'attack',
  password: 'qwerty123'
})

bot.on('spawn', () => {
  mineflayerViewer(bot, { port: 3002 }) // Start the viewing server on port 3000

  // Start auto-attack interval (every 5 seconds)
  bot.loadPlugin(autoEat.loader)
  bot.autoEat.enableAuto()
  attackEntity()
  setInterval(() => {
    attackEntity()
  }, 5000)


})


function attackEntity () {
  const entity = bot.nearestEntity(bot.entity.type.mob)
  if (entity){ 
      bot.attack(entity)

  }
}
