%start document

%%

// The content of a file is handled just like the content that follows
// the heading of a child form.
//
// The raw value from the parser is postprocessed with
// commonform-fix-strings to avoid any string-related errors, like
// leading and trailing whitespace. commonform-fix-strings is required
// at the very end of the .jison grammar file.
document: content END  { return fix({ content: $1 }) };

// The content of a form is an alternating list of paragraphs and series
// of child forms. Making this work in plain BNF and a single token of
// lookahead requires some boilerplate.
content
  : paragraph                      { $$ = $1 }
  | paragraphThenSeries            { $$ = $1 }
  | paragraphThenSeries paragraph  { $$ = $1.concat($2) }
  | series                         { $$ = $1 }
  | seriesThenParagraph            { $$ = $1 }
  | seriesThenParagraph series     { $$ = $1.concat($2) };

paragraphThenSeries
  : paragraph series                      { $$ = $1.concat($2) }
  | paragraphThenSeries paragraph series  { $$ = $1.concat($2, $3) };

seriesThenParagraph
  : series paragraph                      { $$ = $1.concat($2) }
  | seriesThenParagraph series paragraph  { $$ = $1.concat($2, $3) };

// A "series" is one or more contiguous child forms.
series: INDENT children OUTDENT  { $$ = $2 };

children
  : child           { $$ = [ $1 ] }
  | children child  { $$ = $1.concat($2) };

child
  : childWithHeading     { $$ = $1 }
  | childWithoutHeading  { $$ = $1 };

childWithoutHeading
  : BACKSLASH BACKSLASH content  { $$ = { form: fix({ content: $3 }) } }
  | BACKSLASH BANGS content      { $$ = { form: fix({
                                            conspicuous: 'yes',
                                            content: $3 }) } };

childWithHeading
  : heading BACKSLASH content { $$ = { heading: $1,
                                         form: fix({ content: $3 }) } }
  | heading BANGS content     { $$ = { heading: $1,
                                         form: fix({
                                           conspicuous: 'yes',
                                           content: $3 }) } };

heading: BACKSLASH TEXT { $$ = $2 };

// A paragraph can have text, blanks, definitions, references, and uses
// of defined terms.
paragraph
  : TEXT                  { $$ = [ $1 ] }
  | blank                 { $$ = [ $1 ] }
  | definition            { $$ = [ $1 ] }
  | reference             { $$ = [ $1 ] }
  | use                   { $$ = [ $1 ] }
  | paragraph TEXT        { $$ = $1.concat($2) }
  | paragraph blank       { $$ = $1.concat($2) }
  | paragraph definition  { $$ = $1.concat($2) }
  | paragraph reference   { $$ = $1.concat($2) }
  | paragraph use         { $$ = $1.concat($2) };

blank
  : LEFT_BRACKET TEXT RIGHT_BRACKET  { $$ = { blank: $2 } }
  | LEFT_BRACKET RIGHT_BRACKET       { $$ = { blank: '' } };

definition: QUOTES       TEXT QUOTES         { $$ = { definition: $2 } };
reference:  LEFT_BRACE   TEXT RIGHT_BRACE    { $$ = { reference: $2 } };
use:        LEFT_ANGLE   TEXT RIGHT_ANGLE    { $$ = { use: $2 } };

%%

var fix = require('commonform-fix-strings')
