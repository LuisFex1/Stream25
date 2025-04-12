module.exports = {
   models : ['owner','%comand'],
   desc : 'Envia una encuesta al chat',
   comand : ['encuesta'],
   isPrivate : true ,
   async exec(m,{ sock }) {
     
    let name = `Menú de Acciones`
    let values = ['imagen','video','archivos','nota de voz','texto','ubicacion','poll','sticker','notificacion','spamfex','reaccion']
    
    await sock.sendMessage(m.from,{ 
       poll : {
          name ,
          values ,
          selectableCount: 1
       }
    },{ quoted : m })
    
   }
   

}