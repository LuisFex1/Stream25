const axios = require('axios')
const fs = require('fs')

module.exports = new class Functions {
   
   mimetype = async (path) => {
      return (await import('file-type')).fileTypeFromBuffer(path)
   }

   getFile = async (path) => {

      const isUrl = await this.isUrl(path)
      const isFile = await fs.existsSync(path)
      let res = {}
      if (isUrl) {
         res.mimetype = (await this.getBuffer(path)).mimetype
         res.buffer = { url: path }
         res.isFile = true
      } else if (isFile) {
         res.mimetype = (await this.mimetype(fs.readFileSync(path))).mime
         res.buffer = fs.readFileSync(path)
         res.isFile = true
      } else if (Buffer.isBuffer(path)) {
         res.mimetype = (await this.mimetype(path)).mime
         res.buffer = path
         res.isFile = true
      } else {
         res.mimetype = null
         res.buffer = null
         res.isFile = false
      }
      return res
   }

   getBuffer = async (path) => {
      try {
         const res = await axios.get(path, { responseType: 'arrayBuffer' })
         return {
            mimetype: res.headers['content-type'],
            buffer: Buffer.from(res.data)
         }
      } catch (e) {
         this.error('Getbuffer', e)
      }
   }

   isUrl = (url) => {
      try {
         new URL(url)
         return true
      } catch (e) {
         return false
      }
   }
   number = (input) => input.replace(/[^0-9]/g, '')

   sleep = async (time) => await new Promise((resolve) => setTimeout(resolve, time))

   error = (name, e) => {
      console.log('\n', {
         name,
         message: e.message
      }, '\n')
   }
}