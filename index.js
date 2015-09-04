var tokenizeLines = require('./tokenize-lines')
var readContent = require('./read-content')
var checkIndentation = require('./check-indentation')
var buildForm = require('./build-form')

function commonformMarkupParse(input) {
  return input.split('\n')
    .reduce(tokenizeLines, [])
    .map(readContent)
    .map(checkIndentation)
    .reduce(buildForm, { content: [ ] }) }

module.exports = commonformMarkupParse
