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

  test.deepEqual(
    parse('    \\\\a test'),
    { content: [ { form: { content: [ 'a test' ] } } ] })

  test.deepEqual(
    parse(
      [ '    \\\\a',
        '        \\\\b' ].join('\n')),
    { content: [
      { form: { content: [
        'a',
        { form: { content: [ 'b' ] } } ] } } ] })

  test.deepEqual(
    parse(
      [ 'a',
        '    \\\\b',
        '        \\\\c' ].join('\n')),
    { content: [
      'a',
      { form: { content: [
        'b',
        { form: { content: [ 'c' ] } } ] } } ] })

  test.end() })
