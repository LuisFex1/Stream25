module.exports = {
   models : ['media','%comand'],
   desc : 'Envia una imagen a un chat',
   comand : ['img','imagen'],
   isPrivate : true ,
   async exec(m,{ sendMedia }){
      
      const caption = `Texto de la imagen`
      const path = './Files/Jpeg/menu.jpeg'
      
      await sendMedia(path,caption)
   }
}