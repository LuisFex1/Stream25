module.exports = {
   models: ['owner', '%comand text|opc1|opc2'],
   desc: 'Crea una encuesta con opciones',
   comand: ['poll'],
   isAdmin: true,
   async exec(m, { sock, reply, reac , presence }) {

      let v = []
      let y = m.text.split(/\/|\|/g)
      
      await presence('text')
      if (!y[0]) {
         await reply(`🚩 Coloca la pregunta que se hara en la encuesta\n*Ejmp* : ${m.prefix + m.comand} ¿√4 - 1 = 0! ?|si|no|mas...`)
         return
      }

      if (!y[1] || !y[2]) {
         await reply(`🚩 Coloca las respuestas de la encuesta\n*Ejmp* : ${m.prefix + m.comand} ¿√4 - 1 = 0! ?|si|no|mas...`)
         return
      }

      if (v.length > 15) {
         await reply(`🚩 Ingreso demasiadas respuestas, limite de 15`)
         return
      }

      for (let i = 1; i < y.length; i++) {
         for (let x = i + 1; x < y.length; x++) {
            if (y[i] === y[x]) {
               await reac('❌')
               await reply(`🚩 La opcion ${i} se repite con la opcion ${x}. Intente no poner las mismas opciones.`);
               return;
            };
         };
         v.push(y[i]);
      };

      await reac('⌛')

      let teks = `  *ENCUESTA DE ${bot.name}*\n\n`
      teks += `*Encuesta* : ${y[0]}`

      await reac('✅')
      await sock.sendMessage(m.from, {
         poll: {
            name: teks,
            values : v,
            selectableCount: 1
         }
      },{ quoted : m })
   }
}