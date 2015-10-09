module.exports = tokenizeContent

var TOKEN_CHARACTER = 'char'
var TOKEN_BACKSLASH = 'slash'
var TOKEN_OPEN_BRACKET = '['
var TOKEN_CLOSE_BRACKET = ']'
var TOKEN_OPEN_BRACE = '{'
var TOKEN_CLOSE_BRACE = '}'
var TOKEN_OPEN_ANGLE = '<'
var TOKEN_CLOSE_ANGLE = '>'
var TOKEN_QUOTE = '"'
var TOKEN_TEXT = 'text'

var CHAR_TOKENS = {
  '\\': TOKEN_BACKSLASH,
  '[': TOKEN_OPEN_BRACKET,
  ']': TOKEN_CLOSE_BRACKET,
  '{': TOKEN_OPEN_BRACE,
  '}': TOKEN_CLOSE_BRACE,
  '<': TOKEN_OPEN_ANGLE,
  '>': TOKEN_CLOSE_ANGLE,
  '"': TOKEN_QUOTE }

// Non-printable-ASCII characters and tabs are not allowed.
var ILLEGAL = /[^\x20-\x7E]|\t/

function tokenizeContent(string, line, offset) {
  var arrayOfTokens = [ ]
  // For each character in the string
  for (var index = 0; index < string.length; index++) {
    var character = string.charAt(index)
    // If the character is illegal, throw an error.
    if (ILLEGAL.test(character)) {
      throw new Error(
        'Invalid character "' + character + '"' +
        ' at line ' + line + ' column ' + ( offset + index )) }
    // If it's potentially a special character, emit the corresponding token.
    else if (CHAR_TOKENS.hasOwnProperty(character)) {
      arrayOfTokens.push({
        type: CHAR_TOKENS[character],
        line: line,
        column: ( offset + index ),
        string: character }) }
    // Otherwise, emit a character token.
    else {
      arrayOfTokens.push({
        type: TOKEN_CHARACTER,
        line: line,
        column: ( offset + index ),
        string: character }) } }
  // Combine consecutive character tokens into text tokens.
  return arrayOfTokens
    .reduce(
      function(returned, token, index, tokens) {
        var precedingToken = ( ( index > 0 ) ? tokens[index - 1] : false )
        var consecutiveText = (
          precedingToken &&
          ( precedingToken.type === TOKEN_CHARACTER ) &&
          ( token.type === TOKEN_CHARACTER) )
        if (consecutiveText) {
          returned[( returned.length - 1 )].string += token.string
          precedingToken = token
          return returned }
        else {
          precedingToken = token
          return returned.concat({
            type: TOKEN_TEXT,
            column: token.column,
            line: token.line,
            string: token.string }) } },
      [ ]) }

