module.exports = ParserState

function ParserState(tokens, index) {
  this.index = index || 0
  this.tokens = tokens }

var prototype = ParserState.prototype

prototype.empty = function() {
  return ( this.index === this.tokens.length ) }

prototype.consume = function() {
  if (this.empty()) {
    return null }
  else {
    var nextIndex = ( this.index + 1 )
    var next = new ParserState(this.tokens, nextIndex)
    var token = this.tokens[this.index]
    return { state: next, token: token } } }

prototype.expect = function(expectedTokenType) {
  var result = this.consume()
  if (result === null || result.token.type !== expectedTokenType) {
    return null }
  else {
    return result } }

prototype.peek = function() {
  if (this.empty()) {
    return null }
  else {
    return this.tokens[this.index] } }
