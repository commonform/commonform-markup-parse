// This module is an adapter from the tokenizer function to Jison, which has
// its own Bison-like lexer API. In addition to emitting tokens as the
// Jison-generated parser expects, the adapter also makes column and line
// information available for error messages &c.

module.exports = CommonFormScanner

var tokenize = require('./tokenize-lines')

function CommonFormScanner() {
  this.setInput = function(string) {
    this.tokens = tokenize(string) }
  this.lex = function() {
    var token = this.tokens.shift()
    var string = token.string
    var line = token.line
    var column = token.column
    this.yylineno = line
    this.yytext = string
    this.yyloc = {
      first_line: line,
      last_line: line,
      // Jison input columns are 0-indexed, not 1-indexed.
      first_column: ( column - 1 ),
      last_column: ( column - 1 + string.length ) }
    return token.type } }
