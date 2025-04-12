module.exports = {
   models: ['owner', '%comand <media/tag>'],
   desc: 'Notifica a todo el grupo sin el @',
   comand: ['notify', 'nt'],
   isAdmin : true,
   async exec(m, { sock, reply }) {

      const hidetag = async (message) => {
         await sock.sendMessage(m.from, {
            ...message,
            mentions: await m.data.participants.map(i => i.id)
         }, { quoted: m })

      }
      if (m.quoted) {

         await hidetag({
            forward: {
               key: m.quoted.key,
               message: m.quoted.message
            }
         })

      } else if (m.type !== 'extendedTextMessage') {

         await hidetag({
      [m.type.replace('Message', '')]: m.down(),
            caption: m.msg.caption.slice(m.comand.length + 1).toLowerCase().replace('mention', ''),
            mimetype: m.msg.mimetype
         })
      } else if (m.args.join(' ')) {
         await hidetag({
            text: m.args.join(' ').replace('mention', '')
         })
      } else {
         await reply('*Marca un mensaje o escribe algo a transmitir*')
      }
   }
}