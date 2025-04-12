const { proto } = require('@whiskeysockets/baileys');

module.exports = async (sock, m) => {
   if (!sock || !m) return
   m.net = '@s.whatsapp.net'
   m.name = m.pushName || 'annonymous'
   m.bc = m.broadcast || false
   m.bot = sock.user.id.split(':')[0] + m.net

   if (m.key) {
      m.id = m.key.id
      m.from = m.key.remoteJid
      m.isGroup = m.from.endsWith('@g.us')
      m.chat = m.key.participant || m.from
      m.mentioned = m.chat.split('@')[0]
      m.isMe = m.key.fromMe 
      if (m.isGroup) {
         m.data = await sock.groupMetadata(m.from)
         m.admins =  m.data.participants.filter(i => i.admin !== null).map(i => i.id)
         m.isAdmin = m.admins.includes(m.chat)
         m.isBotAdmin = m.admins.includes(m.bot)
      }
   }
   m.nums = await bot.owner.map(i => i.number + m.net)
   m.isOwner = m.nums.includes(m.chat)
   if (m.message) {
      m.type = Object.keys(m.message).filter(key => key !== 'senderKeyDistributionMessage' && key !== 'messageContextInfo')[0]
      m.msg = m.message[m.type]

      m.body = (m.type === 'conversation') ? m.msg : (m.type === 'extendedTextMessage') ? m.msg.text : (m.type === 'imageMessage') ? m.msg.caption : (m.type === 'videoMessage') ? m.msg.caption : ''

      m.prefixos = bot.prefijos || ['/']
      
      m.cmd = m.prefixos.some(i => m.body.toLowerCase().startsWith(i))
      m.comand = m.cmd ? m.body.slice(1).trim().toLowerCase().split(' ')[0] : m.body.trim().toLowerCase().split(' ')[0]
      m.prefix = m.cmd ? m.body.split('')[0] : ''
      
      m.args = m.body.slice(m.cmd ? 1 + m.comand.length : 0).trim().split(/ +/)
      m.text = m.args.join(' ').toLowerCase()
      m.isMedia = !!m.msg.mimetype && ('directPath' in m.msg)
      
      if (m.isMedia) {
         m.mimetype = m.msg.mimetype
         m.isMp4 = /(video|mp4)/.test(m.mimetype)
         m.isMp3 = /(mp3|audio)/.test(m.mimetype)
         m.isJpeg = /(jpeg)/.test(m.mimetype)
         m.isWebp = ('isAnimated' in m.msg)
         if (m.isWebp) {
            m.isAnimated = m.msg.isAnimated
            m.fileSha256 = m.msg.fileSha256.toString()
         }
      }
      m.down = async () => await sock.downloadMedia(m.msg, m.type.replace('Message', ''))
      m.delete = async () => await sock.sendMessage(m.from, { delete: m.key })

      m.quoted = (m.msg && m.msg.contextInfo && Object.keys(m.msg?.contextInfo).some(i => i === 'quotedMessage')) ? proto.WebMessageInfo.fromObject({
         key: {
            remoteJid: m.from,
            fromMe: (m.msg.contextInfo.participant === m.bot),
            id: m.msg.contextInfo.stanzaId,
            participant: m.msg.contextInfo.participant
         },
         message: m.msg.contextInfo.quotedMessage
      }) : false

      if (m.quoted) {
         m.quoted.type = (Object.keys(m.quoted.message)[0] === 'senderKeyDistributionMessage') ? (Object.keys(m.quoted.message)[1] === 'messageContextInfo') ? Object.keys(m.quoted.message)[2] : Object.keys(m.quoted.message)[1] : Object.keys(m.quoted.message)[0]

         m.quoted.msg = m.quoted.message[m.quoted.type]

         m.quoted.chat = m.quoted.key.participant
         m.quoted.mentioned = m.quoted.chat.split('@')[0]

         m.quoted.down = async () => await sock.downloadMedia(m.quoted.msg, m.quoted.type.replace('Message', ''))
         m.quoted.delete = async () => await sock.sendMessage(m.from, { delete: m.quoted.key })

         m.quoted.isMedia = !!m.quoted.msg.mimetype && ('directPath' in m.quoted.msg)
         
         if (m.quoted.isMedia) {
            m.quoted.mimetype = m.quoted.msg.mimetype
            m.quoted.isMp4 = /(video|mp4)/.test(m.mimetype)
            m.quoted.isMp3 = /(mp3|audio)/.test(m.quoted.mimetype)
            m.quoted.isJpeg = /(jpeg)/.test(m.quoted.mimetype)
            m.quoted.isWebp = ('isAnimated' in m.quoted.msg)
            if (m.quoted.isWebp) {
               m.quoted.isAnimated = m.quoted.msg.isAnimated
               m.quoted.fileSha256 = m.quoted.msg.fileSha256.toString()
            }
         }
      }
   }
   return m
}