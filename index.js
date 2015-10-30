var Scanner = require('./scanner')
var Parser = require('./parser').Parser

var extractDirections = require('./extract-directions')

module.exports = function(string) {
  var parser = new Parser
  parser.lexer = new Scanner
  var result = parser.parse(string)
  return extractDirections(result) }
