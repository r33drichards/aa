/*
 *
 * A bot that attacks the player that sends a message or the nearest entity (excluding players)
 *
 */
const mineflayer = require('mineflayer')
const mineflayerViewer = require('prismarine-viewer').mineflayer

const botOptions = {
  host: 'centerbeam.proxy.rlwy.net',
  port: 40387,
  username: 'attack',
  password: 'qwerty123'
}

let bot
let attackInterval

function createBot() {
  bot = mineflayer.createBot(botOptions)

  bot.on('spawn', () => {
    mineflayerViewer(bot, { port: 3002 })

    attackEntity()
    attackInterval = setInterval(() => {
      attackEntity()
    }, (parseInt(process.env.ATTACK_INTERVAL, 10) || 5000));
  });

  bot.on('end', (reason) => {
    console.log(`Disconnected: ${reason}. Reconnecting in 5 seconds...`)
    if (attackInterval) {
      clearInterval(attackInterval)
      attackInterval = null
    }
    setTimeout(createBot, 5000)
  })

  bot.on('error', (err) => {
    console.log(`Error: ${err.message}`)
  })
}

function attackEntity() {
  // Check if bot is still connected before attempting any operations
  if (!bot || !bot.entity || !bot._client || bot._client.ended) {
    return
  }

  try {
    // Diagnostic: Log all nearby entities to understand what's available
    const allEntities = Object.values(bot.entities)
    console.log(`Total entities loaded: ${allEntities.length}`)
    const entityTypes = allEntities.map(e => `${e.type}:${e.name || e.displayName || 'unknown'}`).slice(0, 10)
    console.log(`Entity types nearby: ${entityTypes.join(', ') || 'none'}`)

    const entity = bot.nearestEntity((e) => e.type === 'hostile')
    console.log(`Found mob entity: ${entity ? entity.name || entity.displayName : 'null'}`);
    if (entity) {
      // Find and equip a sword before attacking
      const sword = bot.inventory.items().find(item => item.name.includes('sword'))
      if (sword) {
        bot.equip(sword, 'hand').then(() => {
          // Check again if bot is still connected before attacking
          if (bot && bot._client && !bot._client.ended) {
            console.log(`Equipped ${sword.name}`);
            bot.attack(entity)
          }
        }).catch(err => {
          // Only log non-EPIPE errors or if bot is still connected
          if (err.code !== 'EPIPE' && bot && bot._client && !bot._client.ended) {
            console.log(`Failed to equip sword: ${err.message}`);
            bot.attack(entity) // Attack anyway
          }
        })
      } else {
        console.log("No sword in inventory, attacking with current item");
        bot.attack(entity)
      }
    }
  } catch (err) {
    // Silently ignore EPIPE errors as they indicate disconnection
    if (err.code !== 'EPIPE') {
      console.log(`Error in attackEntity: ${err.message}`)
    }
  }
}

createBot()
