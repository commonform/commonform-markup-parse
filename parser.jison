%start document

%%

document
  : TEXT EOF
    { return { content: [ $1 ] } }
  ;
