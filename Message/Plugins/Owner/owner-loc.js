module.exports = {
   models : ['owner','%comand'],
   desc : 'Envia la ubicación de un lugar' ,
   comand : ['loc','ubicacion'] ,
   isPrivate : true ,
   async exec(m,{ sendLocation }){
      
      const latitud = -8.149639
      const longitud = -79.001868
      const name = 'Batan Mochero'
      const desc = 'Visitanos'
      
      await sendLocation(latitud,longitud,name,desc)
   }
   
}