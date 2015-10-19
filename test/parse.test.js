var tape = require('tape')
var parse = require('..')

tape('parser', function(test) {

  test.deepEqual(
    parse('a test'),
    { content: [ 'a test' ] },
    '"a test"')

  test.deepEqual(
    parse('a test ""Defined""'),
    { content: [
        'a test ',
        { definition: 'Defined' } ] },
    'content with definition')

  test.deepEqual(
    parse('a test "Defined"'),
    { content: [ 'a test "Defined"' ] },
    'content with quotation marks')

  test.deepEqual(
    parse('<Term>'),
    { content: [ { use: 'Term' } ] },
    'term use')

  test.deepEqual(
    parse('[Blank]'),
    { content: [ { blank: 'Blank' } ] },
    'blank')

  test.deepEqual(
    parse('{Heading}'),
    { content: [ { reference: 'Heading' } ] },
    'reference')

  test.deepEqual(
    parse('    \\\\a test'),
    { content: [ { form: { content: [ 'a test' ] } } ] },
    'single child')

  test.deepEqual(
    parse(
      [ '    \\\\a',
        '        \\\\b' ].join('\n')),
    { content: [
      { form: {
          content: [
            'a',
            { form: { content: [ 'b' ] } } ] } } ] },
    'grandchild')

  test.deepEqual(
    parse(
      [ 'a',
        '    \\\\b',
        '        \\\\c' ].join('\n')),
    { content: [
      'a',
      { form: {
          content: [
            'b',
            { form: { content: [ 'c' ] } } ] } } ] },
    'paragraph, then child and grandchild')

  test.deepEqual(
    parse(
      [ '    \\\\a',
        'b',
        '    \\\\c' ].join('\n')),
    { content: [
        { form: { content: [ 'a' ] } },
        'b',
        { form: { content: [ 'c' ] } } ] },
    'child, paragraph, then child')

  test.deepEqual(
    parse(
      [ 'a',
        '    \\\\b',
        'c' ].join('\n')),
    { content: [
        'a',
        { form: { content: [ 'b' ] } },
        'c' ] },
    'paragraph, child, then paragraph')

  test.deepEqual(
    parse(
      [ 'a',
        'b' ].join('\n')),
    { content: [ 'ab' ] },
    'consecutive lines of paragraph')

  test.deepEqual(
    parse(
      [ 'a',
        '    \\\\b',
        '    \\\\c' ].join('\n')),
    { content: [
        'a',
        { form: { content: [ 'b' ] } },
        { form: { content: [ 'c' ] } } ] },
    'paragraph, then consecutive children')

  test.deepEqual(
    parse([ '    \\!!a' ].join('\n')),
    { content: [
        { form: {
            conspicuous: 'yes',
            content: [ 'a' ] } } ] },
    'conspicuous child')

  test.deepEqual(
    parse([ '    \\h!!a' ].join('\n')),
    { content: [
        { heading: 'h',
          form: {
            conspicuous: 'yes',
            content: [ 'a' ] } } ] },
    'conspicuous with heading')

  test.deepEqual(
    parse([ '    \\h\\a' ].join('\n')),
    { content: [
        { heading: 'h',
          form: { content: [ 'a' ] } } ] },
    'child with heading')

  test.deepEqual(
    parse([ '    \\h\\a' ].join('\n')),
    { content: [
        { heading: 'h',
          form: { content: [ 'a' ] } } ] },
    'trim space in heading')

  test.deepEqual(
    parse([ '    \\a   b\\a' ].join('\n')),
    { content: [
        { heading: 'a b',
          form: { content: [ 'a' ] } } ] },
    'collapse double space in heading')

  test.deepEqual(
    parse([ '    \\  \\a' ].join('\n')),
    { content: [ { form: { content: [ 'a' ] } } ] },
    'collapse double space in heading')

  test.deepEqual(
    parse([ 'a    b' ].join('\n')),
    { content: [ 'a b' ] },
    'collapse double space in text')

  test.deepEqual(
    parse([
      '    \\\\A',
      '        \\\\B',
      'C',
      '    \\\\D' ].join('\n')),
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
      '    \\A\\',
      '        \\B\\U',
      '        \\C\\V',
      '            \\\\W',
      '            \\\\X',
      '        Y',
      '        \\\\Z' ].join('\n')),
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
      'real-world complexity')

  test.end() })
