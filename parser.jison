%start document

%%

document : content END { return { content: $1 } } ;

content
  : paragraph
    { $$ = $1 }
  | paragraph INDENT childList OUTDENT
    { $$ = $1.concat($3) }
  | INDENT childList OUTDENT
    { $$ = $2 }
  ;

childList
  : childList child
    { $$ = $1.concat($2) }
  | child
    { $$ = [ $1 ] }
  ;

child
  : SLASHES content
    { $$ = { form: { content: $2 } } }
  ;

paragraph
  : paragraph TEXT       { $$ = $1.concat($2) }
  | paragraph blank      { $$ = $1.concat($2) }
  | paragraph definition { $$ = $1.concat($2) }
  | paragraph reference  { $$ = $1.concat($2) }
  | paragraph use        { $$ = $1.concat($2) }
  | TEXT                  { $$ = [ $1 ] }
  | blank                 { $$ = [ $1 ] }
  | definition            { $$ = [ $1 ] }
  | reference             { $$ = [ $1 ] }
  | use                   { $$ = [ $1 ] }
  ;

blank : LEFT_BRACKET TEXT RIGHT_BRACKET { $$ = { blank: $2 } } ;

definition : QUOTES TEXT QUOTES { $$ = { definition: $2 } } ;

reference : LEFT_BRACE TEXT RIGHT_BRACE { $$ = { reference: $2 } } ;

use : LEFT_ANGLE TEXT RIGHT_ANGLE { $$ = { use: $2 } } ;
