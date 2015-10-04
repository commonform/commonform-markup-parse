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
      return ( initialSpace / INDENT_WIDTH ) }
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

// Non-printable-ASCII characters and tabs are not allowed.
var ILLEGAL = /[^\x20-\x7E]|\t/

function stringTokens(string, line, offset) {
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
        token: CHAR_TOKENS[character],
        line: line,
        column: ( offset + index ),
        string: character }) }
    // Otherwise, emit a character token.
    else {
      arrayOfTokens.push({
        token: TOKEN_CHARACTER,
        line: line,
        column: ( offset + index ),
        string: character }) } }
  return arrayOfTokens }

function tokenize(text) {
  // Track the indentation of the last-seen line. This it the
  // context-dependency that keeps us from parsing with a context-free grammar.
  var lastIndentation = 0
  return text
    // Split into lines.
    .split('\n')
    // For each line, create an Array of tokens for indentation and content.
    .map(function(line, index) {
      var lineNumber = ( index + 1 )
      // Indentation
      var indentation = indentationOf(line, lineNumber)
      var indentationLength = ( indentation * INDENT_WIDTH )
      var indentationSpaces = repeat(' ', indentationLength)
      // Content
      var content = line.substring(indentationSpaces.length)
      var contentColumn = ( indentationLength + 1 )
      var contentTokens = stringTokens(content, lineNumber, contentColumn)
      // Newline
      var newlineToken = {
        token: TOKEN_NEWLINE,
        line: lineNumber,
        column: ( line.length + 1 ),
        string: '\n' }
      var arrayOfTokens
      // Same indentation as last line
      if (indentation === lastIndentation) {
        arrayOfTokens = contentTokens.concat(newlineToken) }
      // Indented further than last line
      else if (indentation > lastIndentation) {
        // Any line may be indented at most 1 level deeper.
        //
        // This is legal:
        //
        //     1| A
        //     2|     B
        //
        // This is illegal:
        //
        //     1| A
        //     2|         B
        if (indentation - lastIndentation > 1) {
          throw new Error('Line ' + lineNumber + ' is indented too far.') }
        else {
          var indentToken = {
            token: TOKEN_INDENT,
            line: lineNumber,
            column: 1,
            string: indentationSpaces }
          arrayOfTokens = [ indentToken ].concat(contentTokens, newlineToken) } }
      // Indented less than last line
      else if (indentation < lastIndentation) {
        // This line may be indented any number of levels less than the
        // preceding line, as in:
        //
        //     1| A
        //     2|     B
        //     3|         C
        //     4| D
        //
        //  Line 4 is indented 2 levels less than line 3.
        //
        //  The tokens for line 4 will begin with 2 DEDENT tokens.
        //
        //  All together, in pseudo-tokens:
        //
        //      "A" NEWLINE
        //      INDENT  "B"  NEWLINE
        //      INDENT  "C"  NEWLINE
        //      DEDENT  DEDENT  "D"  NEWLINE
        var dedentCount = ( lastIndentation - indentation )
        var dedents = [ ]
        for (var i = 1; i <= dedentCount; i++) {
          dedents.push({
            token: TOKEN_DEDENT,
            line: lineNumber,
            column: 1,
            string: indentationSpaces }) }
        arrayOfTokens = dedents.concat(contentTokens, newlineToken) }
      lastIndentation = indentation
      return arrayOfTokens })
    .reduce(
      function(tokens, array) {
        return tokens.concat(array) },
      [ ]) }
