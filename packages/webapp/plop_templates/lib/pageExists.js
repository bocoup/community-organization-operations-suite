/**
 *
 * Check whether the given page exist (borrowed from react-boilerplate)
 */
const fs = require('fs')
const path = require('path')

const pages = fs.readdirSync(path.join(__dirname, '../../pages'))

module.exports = comp => pages.indexOf(comp) >= 0
