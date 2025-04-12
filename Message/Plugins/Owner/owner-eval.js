const { format } = require('util')

module.exports = {
   models: ['owner'],
   desc: 'Herramienta para evaluar funciones',
   comand: /^[>_]/,
   isOwner: true,
   async exec(m, { sock ,S , F , ...v}) {

      let texto = /return|await/gi.test(m.body) ? `(async() => { ${m.body.slice(1)} })()` : `${m.body.slice(1)}`
      let teks = ''
      try {
         teks = await eval(texto)
      } catch (e) {
         teks = `Error : ${e.message}`
      }
      await sock.reply(m.from,format(teks), m)
   }
}