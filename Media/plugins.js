const fs = require('fs')
const path = require('path')

module.exports = class Plugins {
   constructor(pathFolder = 'Message/Plugins') {
      this.pluginFilter = (file) => /\.js$/.test(file)
      this.folder = path.join(origen, pathFolder)
   }

   readPlugin = (folder) => {
      if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true })

      fs.readdirSync(folder, { withFileTypes: true }).forEach((out) => {

         const plugin = path.join(folder, out.name)
         if (out.isDirectory()) {
            this.readPlugin(plugin)
         } else if (out.isFile()) {
            this.loadPlugin(plugin, out.name)
         }
      })
   }

   loadPlugin = (file, name) => {
      if (!this.pluginFilter(name)) return

      const plugin = require(file)

      if (plugin) plugins.push({
         name,
         disable: false,
         ...plugin,
         file
      })
   }
}