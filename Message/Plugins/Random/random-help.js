module.exports = {
   models : ['random','%comand <nombre>'],
   desc : 'Obtine información de un comando',
   comand : ['help'],
   isPrivate : true ,
   async exec(m,{ reply , presence }){
      
     const comandos = plugins
     .filter(i => !i.disable)
     .filter(i => i.models)
     .filter(i => Array.isArray(i.comand))
     
     await presence('text')
     
     const comand = (m.args || [])[0].toLowerCase()
     
     const plugin = comandos.find(i => i.comand.includes(comand))
     
     if(!plugin){
        await reply('🚩 Comando no encontrado , revisa el menu del bot primero')
        return 
     }
     
     let teks = '  *INFORMACIÓN DEL COMANDO*'
     teks += `\n> By *${bot.name}*\n`
     teks += `\n • *File* : ${plugin.name}`
     teks += `\n • *Desc* : ${plugin.desc}`
     teks += `\n • *Uso* : ${plugin.models[1].replace('%comand',m.prefix+comand)}`
     teks += `\n • *Comandos similares* : ${plugin.comand.join(', ')}`
     teks += `\n • *Activo* : ${plugin.disable ? '❌':'✅'}`
     await reply(teks)
   }
}