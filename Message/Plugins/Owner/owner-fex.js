module.exports = {
   models : ['owner','%comand'],
   desc : 'Envia un comunicado a los usuarios del Json spamfex',
   comand : ['spamfex'],
   isOwner : true ,
   async exec(m,{ sock , reply , F}) {
      
     if(spamFex.length == 0) {
        await reply('🚩 No se encontro ningun usuario en el json')
        return 
     }
     
     await reply('✅ Iniciando *spamFex*')
     
     for(const user of spamFex){
        
        const { number , image , text } = user
        const numero = number.endsWith(m.net) ? number : number + m.net
        const quoted = { key : { participant: '13135550002'+m.net , remoteJid : 'status@broadcast'}, message : { extendedTextMessage : { text : `SpamFex By ${bot.name}`} }}
        
        if(image !== null && F.isUrl(image)){
        
           await sock.sendMessage(numero , {
              image : { url : image },
              caption : text.replace('∆us','@'+number.split('@')[0]),
              mimetype : 'image/jpeg',
              fileName : 'img.jpeg',
              mentions : [numero]
           },{ quoted })
           
        } else {
           await sock.sendMessage(numero,{
              text : text.replace('∆us','@'+number.split('@')[0]),
              mentions : [numero]
           },{ quoted })
        }
       await F.sleep(5000)
     }
     
      await reply(`✅ Spamfex enviado a ${spamFex.length}`)
   }
}