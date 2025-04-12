module.exports = {
   models : ['random','%comand'],
   desc : 'Genera el menu de comandos',
   comand : ['menu'],
   isPrivate : true ,
   async exec(m, { sendMedia , F , presence }){
      
      
      let comands = []
      let comandos = plugins
      .filter(i => !i.disable)
      .filter(i => i.models)
      .filter(i => Array.isArray(i.comand))
      
      await presence('text')
      
      let teks = `
Hola , @${m.mentioned} , Aqui tienes mi menú de comandos ,

 *𝌆 「 INFORMACIÓN 」* 

  ꔷ *Nombre* : ${bot.name}
  ꔷ *Version* : 1.0.0
  ꔷ *Prefix* : ${JSON.stringify(bot.prefijos)}

 *𝌆 「 COMANDOS 」* 
`
   for(const plugin of comandos){
      const [ tag , model ] = plugin.models 
      plugin.comand.filter(i => i.length > 3).forEach(i => comands.push(model.replace('%comand',m.prefix+i).split(' ')[0]))
   }
   
    comands.forEach((i) => {
        teks += `\n   ➛ \`\`\`${i}\`\`\``
   })
   
   await sendMedia('./Files/Jpeg/menu.jpeg',teks,m.chat)
   }
}