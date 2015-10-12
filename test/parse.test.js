var tape = require('tape')
var parse = require('..')

tape('parser', function(test) {

  test.deepEqual(
    parse('a test'),
    { content: [ 'a test' ] })

  test.deepEqual(
    parse('a test ""Defined""'),
    { content: [
      'a test ',
      { definition: 'Defined' } ] })

  test.deepEqual(
    parse('a test "Defined"'),
    { content: [ 'a test "Defined"' ] })

  test.deepEqual(
    parse('<Term>'),
    { content: [ { use: 'Term' } ] })

  test.deepEqual(
    parse('[Blank]'),
    { content: [ { blank: 'Blank' } ] })

  test.deepEqual(
    parse('{Heading}'),
    { content: [ { reference: 'Heading' } ] })

  test.end() })
