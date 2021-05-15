// vite.config.js
const { resolve } = require('path')

module.exports = {
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        modelviewer: resolve(__dirname, 'modelviewer.js'),
        sculptures: resolve(__dirname, 'sculptures/index.html'),
      }
    }
  }
}