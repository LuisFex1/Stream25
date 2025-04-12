const Plugins = require('./Media/plugins.js');
const F = require('./Media/functions');
const fs = require('fs');

global.bot = JSON.parse(fs.readFileSync('./Files/Json/config.json'))
global.spamFex = JSON.parse(fs.readFileSync('./Files/Json/spamfex.json'))
global.sms = JSON.parse(fs.readFileSync('./Files/Json/automatic.json'))

global.origen = process.mainModule.path

try {
   global.plugins = []
   const plugin = new Plugins('Message/Plugins')
   plugin.readPlugin(plugin.folder)
} catch (e) {
   F.error('read plugins',e)
}