module.exports = {
   models : ['media','%comand'],
   desc : 'Envia una imagen a un chat',
   comand : ['mp3','audio'],
   isPrivate : true ,
   async exec(m,{ sendMedia }){
      
      const path = './Files/Mp3/audio.mp3'
      
      await sendMedia(path)
   }
}