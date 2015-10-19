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
    parse('    \\\\\\\\a test'),
    { content: [ { form: { content: [ 'a test' ] } } ] })

  test.deepEqual(
    parse(
      [ '    \\\\\\\\a',
        '        \\\\\\\\b' ].join('\n')),
    { content: [
      { form: {
          content: [
            'a',
            { form: { content: [ 'b' ] } } ] } } ] })

  test.deepEqual(
    parse(
      [ 'a',
        '    \\\\\\\\b',
        '        \\\\\\\\c' ].join('\n')),
    { content: [
      'a',
      { form: {
          content: [
            'b',
            { form: { content: [ 'c' ] } } ] } } ] })

  test.deepEqual(
    parse(
      [ '    \\\\\\\\a',
        'b',
        '    \\\\\\\\c' ].join('\n')),
    { content: [
        { form: { content: [ 'a' ] } },
        'b',
        { form: { content: [ 'c' ] } } ] })

  test.deepEqual(
    parse(
      [ 'a',
        '    \\\\\\\\b',
        'c' ].join('\n')),
    { content: [
        'a',
        { form: { content: [ 'b' ] } },
        'c' ] })

  test.deepEqual(
    parse(
      [ 'a',
        'b' ].join('\n')),
    { content: [ 'ab' ] },
    'consecutive lines')

  test.deepEqual(
    parse(
      [ 'a',
        '    \\\\\\\\b',
        '    \\\\\\\\c' ].join('\n')),
    { content: [
        'a',
        { form: { content: [ 'b' ] } },
        { form: { content: [ 'c' ] } } ] },
    'consecutive children')

  test.deepEqual(
    parse([ '    \\\\!!a' ].join('\n')),
    { content: [
        { form: {
            conspicuous: 'yes',
            content: [ 'a' ] } } ] },
    'conspicuous child')

  test.deepEqual(
    parse([ '    \\\\h!!a' ].join('\n')),
    { content: [
        { heading: 'h',
          form: {
            conspicuous: 'yes',
            content: [ 'a' ] } } ] },
    'conspicuous with heading')

  test.deepEqual(
    parse([ '    \\\\h\\\\a' ].join('\n')),
    { content: [
        { heading: 'h',
          form: { content: [ 'a' ] } } ] },
    'with heading')

  test.deepEqual(
    parse([ '    \\\\h\\\\a' ].join('\n')),
    { content: [
        { heading: 'h',
          form: { content: [ 'a' ] } } ] },
    'trim space in heading')

  test.deepEqual(
    parse([ '    \\\\a   b\\\\a' ].join('\n')),
    { content: [
        { heading: 'a b',
          form: { content: [ 'a' ] } } ] },
    'collapse double space in heading')

  test.deepEqual(
    parse([ '    \\\\  \\\\a' ].join('\n')),
    { content: [ { form: { content: [ 'a' ] } } ] },
    'collapse double space in heading')

  test.deepEqual(
    parse([ 'a    b' ].join('\n')),
    { content: [ 'a b' ] },
    'collapse double space in text')

  test.deepEqual(
    parse([
      '    \\\\\\\\A',
      '        \\\\\\\\B' ].join('\n')),
      { content: [
          { form: {
              content: [
                'A',
                { form: { content: [ 'B' ] } } ] } } ] },
      'text A text B')

  test.deepEqual(
    parse([
      '    \\\\\\\\A',
      '        \\\\\\\\B',
      'C',
      '    \\\\\\\\D' ].join('\n')),
      { content: [
          { form: {
              content: [
                'A',
                { form: { content: [ 'B' ] } } ] } },
          'C',
          { form: { content: [ 'D' ] } } ] },
      'deep dedent to paragraph')

  test.deepEqual(
    parse([
      '    \\\\A\\\\',
      '        \\\\B\\\\U',
      '        \\\\C\\\\V',
      '            \\\\\\\\W',
      '            \\\\\\\\X',
      '        Y',
      '        \\\\\\\\Z' ].join('\n')),
      { content: [
          { heading: 'A',
            form: {
              content: [
                { heading: 'B',
                  form: { content: [ 'U' ] } },
                { heading: 'C',
                  form: {
                    content: [
                      'V',
                      { form: { content: [ 'W' ] } },
                      { form: { content: [ 'X' ] } },
                      'Y' ] } },
              { form: { content: [ 'Z' ] } } ] } } ] },
      'real-world')

  test.end() })
