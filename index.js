var lex = require('./lex/')
var parse = require('./parse/')

module.exports = function(string) {
  return parse(lex(string)) }
