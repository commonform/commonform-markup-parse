var tape = require('tape')
var parse = require('..')

tape('parser', function(test) {

  test.deepEqual(
    parse('a test'),
    { content: [ 'a test' ] })

  test.end() })
