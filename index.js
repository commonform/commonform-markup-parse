var parse = require('./parse')
var tokenize = require('./tokenize')

module.exports = function(string) {
  return parse(tokenize(string)) }
