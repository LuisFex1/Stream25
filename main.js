// Vy Svn - Team 
require('./handler.js');
const {
   useMultiFileAuthState,
   DisconnectReason,
   Browsers,
   makeCacheableSignalKeyStore
} = require('@whiskeysockets/baileys');

const makeWaConect = require('./Media/whatsapp.js');
const F = require('./Media/functions.js');
const sms = require('./Media/simple.js');
const server = require('./Media/server.js');

const P = require('pino');
const fs = require('fs');
const { Boom } = require('@hapi/boom');
const readline = require('readline');

// Define 'bot' variable
const bot = {
   path: './path/to/credentials',  // Cambia esto por la ruta correcta a tus credenciales
   name: 'MiBot'  // El nombre de tu bot
};

// Crear logger para seguir el flujo de ejecución
const logger = P({
   level: 'info', // Cambia a 'debug' para más detalles
   formatters: {
      level(label) {
         return { level: label }; // Log personalizable
      }
   }
});

const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout
});
const linea = (texto) => new Promise((resolve) => rl.question(texto, resolve));

async function start() {
   logger.info('Estableciendo conexión, espere ....');
   const {
      state,
      saveCreds
   } = await useMultiFileAuthState(bot.path);  // Usando la ruta correcta

   logger.debug('Cargando las credenciales y estado de autenticación');

   global.sock = await makeWaConect({
      printQRinTerminal: false,
      logger,
      browser: Browsers.ubuntu('Chrome'),
      auth: {
         creds: state.creds,
         keys: makeCacheableSignalKeyStore(state.keys, logger)
      },
      generateHighQualityLinkPreview: true,
      markOnlineOnConnect: false,
      linkPreviewImageThumbnailWidth: 192,
      patchMessageBeforeSending: (message) => {
         // Reemplazamos optional chaining por comprobación tradicional
         const requiresPatch = !!(message && message.interactiveMessage);
         if (requiresPatch) {
            logger.debug('Parcheando el mensaje interactivo...');
            message = {
               viewOnceMessage: {
                  message: {
                     messageContextInfo: {
                        deviceListMetadataVersion: 2,
                        deviceListMetadata: {},
                     },
                     ...message,
                  },
               },
            };
         }
         return message;
      }
   });

   if (!sock.authState.creds.registered) {
      const question = await linea('Ingrese su número de teléfono\nDigita tu número: ');

      if (!question) {
         logger.error('Número inválido, recuerda incluir tu código de país, copia y pega tu número directamente de WhatsApp.');
         console.log('Número inválido, recuerda incluir tu código de país, copia y pega tu número directamente de WhatsApp.');
         return;
      }

      logger.info(`Iniciando el proceso de verificación para el número: ${question}`);

      const numero = await F.number(question);
      const codigo = await sock.requestPairingCode(numero);

      logger.info(`Tu código de verificación es: ${codigo.slice(0, 4)}-${codigo.slice(4, 8)}`);
      console.log(`Tu código de verificación es: ${codigo.slice(0, 4)}-${codigo.slice(4, 8)}`);
   }

   sock.ev.on('creds.update', saveCreds);

   sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === 'close') {
         const razon = new Boom(lastDisconnect?.error)?.output?.statusCode;

         switch (razon) {
            case DisconnectReason.badSession:
            case DisconnectReason.connectionReplaced:
            case DisconnectReason.loggedOut: {
               await fs.rmSync(bot.path, { recursive: true });
               logger.error('Error en la sesión, Inicie una nueva');
               console.log('Error en la sesión, Inicie una nueva');
               process.exit();
               break;
            }
            case DisconnectReason.connectionClose:
            case DisconnectReason.restartRequire: {
               logger.warn('Conexión cerrada, reiniciando...');
               console.log('Espere un momento, reiniciando...');
               start();
               break;
            }

            default:
               start();
         }
      } else if (connection === 'open') {
         rl.close();
         logger.info(`-> Bot [${bot.name}] iniciado exitosamente`);
         console.log(`-> Bot [${bot.name}] iniciado exitosamente`);
      }
   });

   sock.ev.on('messages.upsert', async ({ messages, type }) => {
      for (let m of messages) {
         if (type === 'notify') {
            logger.debug(`Recibiendo mensaje para procesar: ${m.key.id}`);
            await require('./Message/upsert.js')(sock, await sms(sock, m));
         }
      }
   });
}

start();
server();
