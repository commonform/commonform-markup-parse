module.exports = parse

var ParserError = require('./parser-error')
var ParserState = require('./parser-state')

var TOKENS = require('./tokens')

function parseFormWithoutHeading(state) {
  var nextToken = state.peek()
  var result = state.expect(TOKENS.TEXT)
  if (!result) {
    throw new ParserError(TOKENS.TEXT, nextToken) }
  var text = result.token.string
  nextToken = result.state.peek()
  result = result.state.expect(TOKENS.NEWLINE)
  if (!result) {
    throw new ParserError(TOKENS.NEWLINE, nextToken) }
  return {
    state: result.state,
    value: { content: [ text ] } } }

function parseForm(state) {
  return parseFormWithoutHeading(state) }

function parse(tokens) {
  var state = new ParserState(tokens)
  var result = parseForm(state)
  if (result === null) {
    throw new Error() }
  else if (!result.state.empty()) {
    throw new Error('Additional content') }
  else {
    return result.value }}
