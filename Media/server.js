const express = require('express');
const F = require('./functions.js')

const app = express()
const port = 8080

app.use(express.json())

app.post('/send', validar, async (query, res) => {
   const {
      number,
      message,
      path,
      type
   } = query.body;

   const id = number.endsWith('@g.us') ? number : (number.endsWith('.net') ? number : number + '@s.whatsapp.net')

   try {
      if (['poll', 'encuesta'].includes(type)) {
         await sock.sendMessage(id, {
            poll: {
               name: message.name,
               values: message.opc,
               selectableCount: 1
            }
         })
      } else if (type === 'media') {
         await sock.sendFile(id, path, message)
      } else if (['video', 'mp4'].includes(type)) {
         await sock.sendMessage(id, {
            video: { url: path },
            mimetype: 'video/mp4',
            caption: message || ''
         })
      } else if (type === 'text') {
         await sock.reply(id, message)
      } else if (['loc', 'location'].includes(type)) {
         const {
            lat,
            long,
            name,
            desc
         } = message
         await sock.sendLoc(id, lat, long, { name, desc })
      } 
      res.json({
         success: true,
         message: '✅ Mensaje enviado exitosamente'
      })
   } catch (e) {
      res.json({
         success: false,
         message: e.message
      })
   }
})

async function validar(query, res, next) {
   try {
      const {
         number,
         message,
         path,
         type,
      } = query.body;

      if (!number) {
         return res.json({
            status: false,
            message: 'Error @number required'
         })
      }
      if (!type) {
         return res.json({
            status: false,
            message: 'Error @type no defined'
         })
      }

      switch (type) {

         case 'media': {
            const { isFile } = await F.getFile(path)
            if (!path || !isFile) {
               return res.json({
                  status: false,
                  message: 'Type @Media , require @path valid'
               })
            }
            next()
            break;
         }
         case 'video':
         case 'mp4': {
            if (!path) {
               return res.json({
                  status: false,
                  message: '@path and required'
               })
            }
            next()
            break;
         }
         case 'loc':
         case 'location': {
            if (!message || !message.name || !message.lat || !message.long || !message.desc) {
               return res.json({
                  status: false,
                  message: 'invalid params , @message'
               })
            }
            next()
            break;
         }

         case 'poll':
         case 'encuesta': {
            if (!message || !message.name || !message.opc) {
               return res.json({
                  status: false,
                  message: 'Invalid params @message'
               })
            }
            next()
            break;
         }
         case 'text': {
            if (!message) {
               return res.json({
                  status: false,
                  message: 'Params @message required'
               })
            }
            next()
            break;
         }
         
         default:
            return res.json({
               status: false,
               message: 'Type not support'
            })
      }
   } catch (e) {
      return res.json({
         status: false,
         message: 'Error inesperado ' + e.message
      })
   }
}

module.exports = async () => {
   app.listen(port, () => {
      console.log(`Servidor HTTP escuchando en http://localhost:${port}`)
   })
}