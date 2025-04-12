const F = require('../Media/functions.js');

module.exports = async (sock, m) => {
   try {

      const sendMedia = async (path, caption, users) => {
         const { isFile, mimetype, buffer } = await F.getFile(path)
         if (!isFile) return console.log('Path invalido')
         const type = /webp|sticker/.test(mimetype) ? 'sticker' : mimetype.split('/')[0]

         return sock.sendMessage(m.from, {
           [type]: buffer,
            caption,
            mimetype,
            mentions: users ? (Array.isArray(users) ? users : [users]) : []
         }, { quoted: m })
      }

      const presence = async (action) => {
         const options = {
            text: "composing",
            audio: "recording",
            active: "available",
            desactive: "unavailable",
            paused: "paused"
         }
         await sock.sendPresenceUpdate(options[action], m.from)
      }
      const reac = async (emoji) => {
         await sock.sendMessage(m.from, {
            react: {
               text: emoji,
               key: m.key
            }
         })
      }
      const reply = async (text, user) => {
         return sock.sendMessage(m.from, {
            text,
            mentions: user ? (Array.isArray(user) ? user : [user]) : []
         }, { quoted: m })
      }
      const sendLocation = async (latitud, longitud, name, desc) => {
         await sock.sendMessage(m.from, {
            location: {
               name: name || '',
               address: desc || '',
               degreesLatitude: latitud,
               degreesLongitude: longitud
            }
         }, { quoted: m })
      }

      const arguments = {
         sock,
         sendMedia,
         sendLocation,
         presence,
         reac,
         reply,
         F
      }

      for (let plugin of plugins) {

         const isComand = !plugin.disable && plugin.comand ? (Array.isArray(plugin.comand) ? plugin.comand.includes(m.comand) && (bot.prefix ? m.cmd : true) : plugin.comand.test(m.body)) : false

         if (isComand && plugin.exec && typeof plugin.exec === 'function') {
            try {
               if (plugin.isPrivate && m.isGroup) {
                  continue
               }
               if (plugin.isOwner && !m.isOwner) {
                  continue
               }
               if (plugin.isAdmin && (!m.isAdmin || !m.isBotAdmin)) {
                  continue
               }
               await plugin.exec.call(plugin, m, arguments)
            } catch (e) {
               F.error(plugin.name, e)
            }
         }

         if (!isComand && plugin.run && typeof plugin.run === 'function') {
            try {
               if (plugin.isPrivate && m.isGroup) {
                  continue
               }
               await plugin.run.call(plugin, m, arguments)
            } catch (e) {
               F.error(plugin.name, e)
            }
         }
      }

   } catch (e) {
      f.error('upsert', e)
   }

}