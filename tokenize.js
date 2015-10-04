module.exports = tokenize

var repeat = require('string-repeat')

var INITIAL_SPACE = /^( *)/
var INDENT_WIDTH = 4

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

var TOKEN_CHARACTER = 'char'
var TOKEN_BACKSLASH = 'slash'
var TOKEN_OPEN_BRACKET = '['
var TOKEN_CLOSE_BRACKET = ']'
var TOKEN_OPEN_BRACE = '{'
var TOKEN_CLOSE_BRACE = '}'
var TOKEN_OPEN_ANGLE = '<'
var TOKEN_CLOSE_ANGLE = '>'
var TOKEN_QUOTE = '"'

var CHAR_TOKENS = {
  '\\': TOKEN_BACKSLASH,
  '[': TOKEN_OPEN_BRACKET,
  ']': TOKEN_CLOSE_BRACKET,
  '{': TOKEN_OPEN_BRACE,
  '}': TOKEN_CLOSE_BRACE,
  '<': TOKEN_OPEN_ANGLE,
  '>': TOKEN_CLOSE_ANGLE,
  '"': TOKEN_QUOTE }

var ILLEGAL = /[^\x20-\x7E]|\t/

function stringTokens(string, line, offset) {
  var returned = [ ]
  for (var index = 0; index < string.length; index++) {
    var character = string.charAt(index)
    if (ILLEGAL.test(character)) {
      throw new Error(
        'Invalid character "' + character + '"' +
        ' at line ' + line + ' column ' + ( offset + index )) }
    else if (CHAR_TOKENS.hasOwnProperty(character)) {
      returned.push({
        token: CHAR_TOKENS[character],
        line: line,
        column: ( offset + index ),
        string: character }) }
    else {
      returned.push({
        token: TOKEN_CHARACTER,
        line: line,
        column: ( offset + index ),
        string: character }) } }
  return returned }

function tokenize(text) {
  var lastIndentation = 0
  return text
    .split('\n')
    .map(function(line, index) {
      var lineNumber = ( index + 1 )
      var indentation = indentationOf(line, lineNumber)
      var indentationLength = ( indentation * INDENT_WIDTH )
      var indentationSpaces = repeat(' ', indentationLength)
      var content = line.substring(indentationSpaces.length)
      var contentColumn = ( indentationLength + 1 )
      var newlineToken = {
        token: TOKEN_NEWLINE,
        line: lineNumber,
        column: ( line.length + 1 ),
        string: '\n' }
      var contentTokens = stringTokens(content, lineNumber, contentColumn)
      var returned
      if (indentation === lastIndentation) {
        returned = contentTokens.concat(newlineToken) }
      else if (indentation > lastIndentation) {
        if (indentation - lastIndentation > 1) {
          throw new Error('Line ' + lineNumber + ' is indented too far.') }
        else {
          var indentToken = {
            token: TOKEN_INDENT,
            line: lineNumber,
            column: 1,
            string: indentationSpaces }
          returned = [ indentToken ].concat(contentTokens, newlineToken) } }
      else if (indentation < lastIndentation) {
        var dedentCount = ( lastIndentation - indentation )
        var dedents = [ ]
        for (var i = 1; i <= dedentCount; i++) {
          dedents.push({
            token: TOKEN_DEDENT,
            line: lineNumber,
            column: 1,
            string: indentationSpaces }) }
        returned = dedents.concat(contentTokens, newlineToken) }
      lastIndentation = indentation
      return returned })
    .reduce(
      function(tokens, array) {
        return tokens.concat(array) },
      [ ]) }
