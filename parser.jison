%start document

%%

document
  : content END  { return { content: $1 } }
  ;

content
  : paragraphs                       { $$ = $1 }
  | paragraphsThenSeries             { $$ = $1 }
  | paragraphsThenSeries paragraphs  { $$ = $1.concat($2) }
  | series                           { $$ = $1 }
  | seriesThenParagraphs             { $$ = $1 }
  | seriesThenParagraphs series      { $$ = $1.concat($2) }
  ;

paragraphsThenSeries
  : paragraphs series                       { $$ = $1.concat($2) }
  | paragraphsThenSeries paragraphs series  { $$ = $1.concat($2).concat($3) }
  ;

seriesThenParagraphs
  : series paragraphs                       { $$ = $1.concat($2) }
  | seriesThenParagraphs series paragraphs  { $$ = $1.concat($2).concat($3) }
  ;

series :
  INDENT childList OUTDENT  { $$ = $2 }
  ;

childList
  : childList child          { $$ = $1.concat($2) }
  | child                    { $$ = [ $1 ] }
  ;

child
  : SLASHES content  { $$ = { form: { content: $2 } } }
  ;

paragraphs
  : paragraphs NEWLINE paragraph  { $$ = $1.concat($3) }
  | paragraph                     { $$ = $1 }
  ;

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
  | paragraph use         { $$ = $1.concat($2) }
  ;

blank
  : LEFT_BRACKET TEXT RIGHT_BRACKET  { $$ = { blank: $2 } }
  ;

definition
  : QUOTES TEXT QUOTES  { $$ = { definition: $2 } }
  ;

reference
  : LEFT_BRACE TEXT RIGHT_BRACE  { $$ = { reference: $2 } }
  ;

use
  : LEFT_ANGLE TEXT RIGHT_ANGLE  { $$ = { use: $2 } }
  ;
