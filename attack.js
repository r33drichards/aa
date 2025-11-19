/*
 *
 * A bot that attacks the player that sends a message or the nearest entity (excluding players)
 *
 */
const mineflayer = require('mineflayer')
const autoEat = require('mineflayer-auto-eat')
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

    bot.loadPlugin(autoEat.loader)
    bot.autoEat.enableAuto()
    attackEntity()
    attackInterval = setInterval(() => {
      attackEntity()
    }, 3000)
  })

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
  if (!bot || !bot.entity) return

  // Diagnostic: Log all nearby entities to understand what's available
  const allEntities = Object.values(bot.entities)
  console.log(`Total entities loaded: ${allEntities.length}`)
  const entityTypes = allEntities.map(e => `${e.type}:${e.name || e.displayName || 'unknown'}`).slice(0, 10)
  console.log(`Entity types nearby: ${entityTypes.join(', ') || 'none'}`)

  const entity = bot.nearestEntity((e) => e.type === 'hostile')
  console.log(`Found mob entity: ${entity ? entity.name || entity.displayName : 'null'}`);
  if (entity) {
    console.log("Attacking");
    bot.attack(entity)
  }

  // Only try to sleep at night
  if (bot.time.isDay) {
    console.log("Skipping sleep - it's daytime")
    return
  }
  console.log("Sleeping");
  const beds = bot.findBlocks({
    matching: bot.registry.blocksByName["white_bed"].id,
    maxDistance: 128,
  });
  beds.forEach(async (bed) => {
    try {

      // wait 1 second
      const bedBlock = bot.blockAt(bed);
      if (bedBlock) {
        await bot.sleep(bedBlock);
      } else {
        console.log("No bed block found");
      }
    } catch (e) {
      console.log("Failed to sleep in bed " + e);
    }
  });

  console.log("Sleeping done");
}

createBot()
