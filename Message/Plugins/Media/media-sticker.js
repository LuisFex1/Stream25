module.exports = {
   models: ['media', '%comand'],
   desc: 'Envia una imagen a un chat',
   comand: ['sticker'],
   isPrivate: true,
   async exec(m, { sendMedia }) {

      const path = './Files/Webp/sticker.webp'

      await sendMedia(path)
   }
}