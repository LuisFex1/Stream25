module.exports = {
   models : ['media','%comand'],
   desc : 'Envia una imagen a un chat',
   comand : ['mp4','video'],
   isPrivate : true ,
   async exec(m,{ sendMedia }){
      
      const caption = `Texto del video`
      const path = './Files/Mp4/video.mp4'
      
      await sendMedia(path,caption)
   }
}