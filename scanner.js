module.exports = CommonFormScanner

var tokenize = require('./tokenize')

function CommonFormScanner() {
  this.setInput = function(string) {
    this.tokens = tokenize(string) }
  this.lex = function() {
    var token = this.tokens.shift()
    var string = token.string
    var line = token.line
    var column = token.column
    this.yytext = string
    this.yyloc = {
      first_line: line,
      first_column: ( column - 1 ),
      last_line: line,
      last_column: ( column - 1 + string.length ) }
    return token.type } }
