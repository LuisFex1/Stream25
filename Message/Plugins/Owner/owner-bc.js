module.exports = {
   models: ['owner', '%comand <media/tag>'],
   desc: 'Manda un comunicado a todos los grupos',
   comand: ['broadcast', 'bc'],
   isOwner: true,
   async exec(m, { sock, reply, sleep }) {
         
      const groups = Object.values(await sock.groupFetchAllParticipating())
         .filter(i => !i.isCommunity)
         .filter(i => !i.isCommunityAnnounce)
         .filter(i => !i.announce)

      const time = 8000 // seconds of next
      const mention = (m.args || []).join(' ').includes('mention')
      const broadcast = async (message) => {
         await reply('*🚩 Iniciando Broadcast*')
         for (const group of groups) {
            await sock.sendMessage(group.id, {
               ...message,
               mentions: mention ? await group.participants.map(i => i.id) : []
            })
         }
         await reply(`✅ Broadcast enviado a ${groups.length}`)
         await sleep(time)
      }

      if (m.quoted) {
         await broadcast({
            forward: {
               key: m.quoted.key,
               message: m.quoted.message
            }
         })
      } else if (m.type !== 'extendedTextMessage') {
         await broadcast({
      [m.type.replace('Message', '')]: await m.down(),
            caption: m.msg.caption.slice(m.comand.length + 1).toLowerCase().replace('mention', ''),
            mimetype: m.msg.mimetype
         })
      } else if (m.args.join(' ')) {
         await broadcast({
            text: m.args.join(' ').replace('mention', '')
         })
      } else {
         await reply('*Marca un mensaje o escribe algo a transmitir*')
      }
   }
}