module.exports = ParserError

function ParserError(expected, saw) {
  this.name = 'ParserError'
  this.message = (
    'Expected ' + expected + ' at ' +
    'line ' + saw.line + ' column ' + saw.column +
    ', but saw ' + saw.type + '.' ) }

ParserError.prototype = Error.prototype
