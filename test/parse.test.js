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

  test.deepEqual(
    parse(
      [ '    \\\\a',
        'b',
        '    \\\\c' ].join('\n')),
    { content: [
      { form: { content: [ 'a' ] } },
      'b',
      { form: { content: [ 'c' ] } } ] })

  test.deepEqual(
    parse(
      [ 'a',
        '    \\\\b',
        'c' ].join('\n')),
    { content: [
      'a',
      { form: { content: [ 'b' ] } },
      'c' ] })

  test.deepEqual(
    parse(
      [ 'a',
        'b' ].join('\n')),
    { content: [ 'a', 'b' ] },
    'consecutive lines')

  test.deepEqual(
    parse(
      [ 'a',
        '    \\\\b',
        '    \\\\c' ].join('\n')),
    { content: [
      'a',
      { form: { content: [ 'b' ] } },
      { form: { content: [ 'c' ] } } ] },
    'consecutive children')

  test.deepEqual(
    parse([ '    !!a' ].join('\n')),
    { content: [
      { form: {
          conspicuous: 'yes',
          content: [ 'a' ] } } ] },
    'conspicuous child')

  test.deepEqual(
    parse([ '    h!!a' ].join('\n')),
    { content: [
      { heading: 'h',
        form: {
          conspicuous: 'yes',
          content: [ 'a' ] } } ] },
    'conspicuous child')

  test.end() })
