module.exports = tokenize

var repeat = require('string-repeat')

var INITIAL_SPACE = /^( *)/
var INDENT_WIDTH = 4
var INDENT_SPACES = repeat(' ', INDENT_WIDTH)

function indentationOf(line, lineNumber) {
  var initialSpace = INITIAL_SPACE.exec(line)[1].length
  if (initialSpace === 0) {
    return 0 }
  else {
    if (initialSpace % INDENT_WIDTH === 0) {
      return initialSpace / INDENT_WIDTH }
    else {
      throw new Error('Invalid indentation on line ' + lineNumber) } } }

var TOKEN_NEWLINE = 'newline'
var TOKEN_INDENT = 'indent'
var TOKEN_DEDENT = 'dedent'
var TOKEN_TEXT = 'text'

function tokenize(text) {
  var lastIndentation = 0
  return text
    .split('\n')
    .map(function(line, index) {
      var lineNumber = ( index + 1 )
      var indentation = indentationOf(line, lineNumber)
      var indentationSpaces = repeat(INDENT_SPACES, indentation)
      var returned
      if (indentation === lastIndentation) {
        returned = [
          { token: TOKEN_TEXT,
            line: lineNumber,
            column: ( ( indentation * INDENT_WIDTH ) + 1 ),
            string: line.substring(indentationSpaces.length) },
          { token: TOKEN_NEWLINE,
            line: lineNumber,
            column: ( line.length + 1 ),
            string: '\n' } ] }
      else if (indentation > lastIndentation) {
        if (indentation - lastIndentation > 1) {
          throw new Error('Line ' + lineNumber + ' is indented too far.') }
        else {
          returned = [
            { token: TOKEN_INDENT,
              line: lineNumber,
              column: 1,
              string: indentationSpaces },
            { token: TOKEN_TEXT,
              line: lineNumber,
              column: ( ( indentation * INDENT_WIDTH ) + 1 ),
              string: line.substring(indentationSpaces.length) },
            { token: TOKEN_NEWLINE,
              line: lineNumber,
              column: ( line.length + 1 ),
              string: '\n' } ] } }
      else if (indentation < lastIndentation) {
        var dedentCount = ( lastIndentation - indentation )
        var dedents = [ ]
        for (var i = 1; i <= dedentCount; i++) {
          dedents.push({
            token: TOKEN_DEDENT,
            line: lineNumber,
            column: 1,
            string: indentationSpaces }) }
        returned = dedents
          .concat([
            { token: TOKEN_TEXT,
              line: lineNumber,
              column: ( ( indentation * INDENT_WIDTH ) + 1 ),
              string: line.substring(indentationSpaces.length) },
            { token: TOKEN_NEWLINE,
              line: lineNumber,
              column: ( line.length + 1 ),
              string: '\n' } ]) }
      lastIndentation = indentation
      return returned })
    .reduce(
      function(tokens, array) {
        return tokens.concat(array) },
      [ ]) }
