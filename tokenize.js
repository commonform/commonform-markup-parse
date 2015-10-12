module.exports = tokenize

var repeat = require('string-repeat')
var times = require('./times')
var tokenizeContent = require('./tokenize-content')
var TOKENS = require('./tokens')

var ALL_SPACE = /^\s*$/
var INITIAL_SPACE = /^( *)/
var INDENT_WIDTH = 4

function tokenize(text) {
  // Track the indentation of the last-seen line. This it the
  // context-dependency that keeps us from parsing with a context-free grammar.
  var lastIndentation = 0
  var lastLine = 0
  var lastColumn = 0
  var seenContent = false
  return text
    // Split into lines.
    .split('\n')
    // For each line, create an Array of tokens for indentation and content.
    .map(function(line, index) {
      if (ALL_SPACE.test(line)) {
        return [ ] }
      else {
        lastColumn = 0
        var lineNumber = ( index + 1 )
        // Indentation
        var indentation = indentationOf(line, lineNumber)
        var indentationLength = ( indentation * INDENT_WIDTH )
        var indentationSpaces = repeat(' ', indentationLength)
        // Content
        var content = line.substring(indentationSpaces.length)
        var contentColumn = ( indentationLength + 1 )
        var contentTokens = tokenizeContent(content, lineNumber, contentColumn)
        var arrayOfTokens
        // Same indentation as last line
        if (indentation === lastIndentation) {
          if (!seenContent) {
            arrayOfTokens = contentTokens }
          else {
            var newlineToken = {
              type: TOKENS.NEWLINE,
              line: ( lineNumber - 1),
              column: ( line.length + 1 ),
              string: '\n' }
            arrayOfTokens = [ newlineToken ].concat(contentTokens) } }
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
              type: TOKENS.INDENT,
              line: lineNumber,
              column: 1,
              string: indentationSpaces }
            arrayOfTokens = [ indentToken ].concat(contentTokens) } }
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
          //  The tokens for line 4 will begin with 2 OUTDENT tokens.
          //
          //  All together, in pseudo-tokens:
          //
          //      "A"
          //      INDENT  "B"
          //      INDENT  "C"
          //      OUTDENT  OUTDENT  "D"
          var outdentCount = ( lastIndentation - indentation )
          var outdents = [ ]
          for (var i = 1; i <= outdentCount; i++) {
            outdents.push({
              type: TOKENS.OUTDENT,
              line: lineNumber,
              column: 1,
              string: indentationSpaces }) }
          arrayOfTokens = outdents.concat(contentTokens) }
        lastIndentation = indentation
        lastColumn = ( contentColumn + content.length )
        lastLine = lineNumber
        seenContent = true
        return arrayOfTokens } })
    .reduce(
      function(tokens, array) {
        return tokens.concat(array) },
      [ ])
    .concat(
      times(
        { type: TOKENS.OUTDENT,
          line: lastLine,
          column: lastColumn,
          string: '' },
        lastIndentation))
    .concat({
      type: TOKENS.END,
      line: lastLine,
      column: lastColumn,
      string: '' }) }

function indentationOf(line, lineNumber) {
  var initialSpace = INITIAL_SPACE.exec(line)[1].length
  if (initialSpace === 0) {
    return 0 }
  else {
    if (initialSpace % INDENT_WIDTH === 0) {
      return ( initialSpace / INDENT_WIDTH ) }
    else {
      throw new Error('Invalid indentation on line ' + lineNumber) } } }
