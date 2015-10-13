module.exports = tokenizeContent

var TOKENS = require('./tokens')

var CHARACTER = 'char'

var CHAR_TOKENS = {
  '[': TOKENS.LEFT_BRACKET,
  ']': TOKENS.RIGHT_BRACKET,
  '{': TOKENS.LEFT_BRACE,
  '}': TOKENS.RIGHT_BRACE,
  '<': TOKENS.LEFT_ANGLE,
  '>': TOKENS.RIGHT_ANGLE }

var DOUBLES = {
  '"': TOKENS.QUOTES,
  '!': TOKENS.BANGS,
  '_': TOKENS.UNDERSCORES,
  '\\': TOKENS.BACKSLASHES }

// Non-printable-ASCII characters and tabs are not allowed.
var ILLEGAL = /[^\x20-\x7E]|\t/

function tokenizeContent(string, line, offset) {
  var arrayOfTokens = [ ]
  var character
  var last
  // For each character in the string
  for (var index = 0; index < string.length; index++) {
    character = string.charAt(index)
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
    else {
      last = arrayOfTokens[( arrayOfTokens.length - 1 )]
      if (last && DOUBLES.hasOwnProperty(character) && last.string === character) {
        last.type = DOUBLES[character]
        last.string += character }
      // Otherwise, emit a character token.
      else {
        arrayOfTokens.push({
          type: CHARACTER,
          line: line,
          column: ( offset + index ),
          string: character }) } } }
  // Combine consecutive character tokens into text tokens.
  return arrayOfTokens
    .reduce(
      function(returned, token, index, tokens) {
        var precedingToken = ( ( index > 0 ) ? tokens[index - 1] : false )
        var consecutiveText = (
          precedingToken &&
          ( precedingToken.type === CHARACTER ) &&
          ( token.type === CHARACTER) )
        if (consecutiveText) {
          returned[( returned.length - 1 )].string += token.string
          return returned }
        else {
          return returned.concat({
            type: (
              ( token.type === CHARACTER ) ?
                TOKENS.TEXT : token.type ),
            column: token.column,
            line: token.line,
            string: token.string }) } },
      [ ]) }
