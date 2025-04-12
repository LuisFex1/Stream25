const {
   makeWASocket,
   downloadContentFromMessage
} = require('@whiskeysockets/baileys');
const F = require('./functions.js')

module.exports = async (args) => {

   const sock = await makeWASocket(args)
   
   Object.defineProperties(sock, {

      sendLoc: {
         async value(from, latitud, longitud, opc = {}) {
            await sock.sendMessage(from, {
               location: {
                  name: opc.name || '',
                  address: opc.desc || '',
                  degreesLatitude: latitud,
                  degreesLongitude: longitud
               }
            })
         }
      },
      presence: {
         async value(from, type) {
            if (!from) return
            const options = {
               text: "composing",
               audio: "recording",
               active: "available",
               desactive: "unavailable",
               paused: "paused"
            }
            await sock.sendPresenceUpdate(options[type], from)
         }
      },

      sendFile: {
         async value(from, path, caption, opc = {}) {
            const { isFile, mimetype, buffer } = await F.getFile(path)
            if (!isFile) return console.log('Path invalido')
            const type = /webp|sticker/.test(mimetype) ? 'sticker' : mimetype.split('/')[0]
            
            const isMp3 = /audio/.test(mimetype)
            const isJpeg = /image/.test(mimetype)
            const isMp4 = /video/.test(mimetype)
            
            const mime = (isMp3 ? 'audio/mpeg' : isJpeg ? 'image/jpeg' : isMp4 ? 'video/mp4':'')
            if(isMp3) await sock.presence(from,'audio')
            
            return sock.sendMessage(from, {
           [type]: buffer,
               caption,
               mimetype : mime ,
               ptt : isMp3 ? true : false ,
               mentions: opc.user ? (Array.isArray(opc.user) ? opc.user : [opc.user]) : []
            })
         }
      },
      downloadMedia: {
         async value(media, type) {
            const stream = await downloadContentFromMessage(media, type)
            let buffer = Buffer.from([])
            for await (let chunk of stream) {
               buffer = Buffer.concat([buffer, chunk])
            }
            return buffer
         },
         enumerable: true
      },
      reply: {
         async value(from, text,opc = {}) {
            await sock.presence(from,'text')
            return await sock.sendMessage(from, {
               text,
               mentions: opc.nums ? (Array.isArray(opc.nums) ? opc.nums : [opc.nums]) : []
            })
         },
         enumerable: true
      }
   })
   return sock
}