const fs = require('fs')

module.exports = {
   models: ['automatic'],
   async run(m, { sock }) {

      if (sms.length === 0) return

      setInterval(async () => {
         const v = new Date().toLocaleTimeString()
         const hora = [v[0], v[1]].join(':') + ' ' + v[2].split(' ')[1]
         const fecha = new Date().toLocaleDateString()
        
        for(const item of sms) {

            if(!item.number) continue
            if(!item.date) continue
            
            if (fecha >= item.date.fecha) {
               if (hora >= item.date.hora) {

                  const number = item.number.endsWith('.us') ? item.number : (item.number.endsWith('.net') ? item.number : item.number + m.net)

                  if (item.path) {
                     await sock.sendFile(number, item.path, (item.message || ''))
                  } else {
                     await sock.reply(number, item.message)
                  }
            const index = sms.indexOf(item)
            
                  sms.splice(index, 1)
                  await fs.writeFileSync('./Files/Json/automatic.json',JSON.stringify(sms,null,2))
               }
            }

         }
      }, 60 * 1000)
   }
}