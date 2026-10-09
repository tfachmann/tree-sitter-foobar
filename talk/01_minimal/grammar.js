export default grammar({
  name: "foobar",
  word: $ => $.identifier,
  extras: $ => [/[ \t\r\n]+/, $.comment],

  rules: {
    source_file: $ => repeat(choice($.section_process)),
    section_process: $ => seq(
      'process',
      $._ws,
      $.name,
      repeat($.entry)
    ),

    name: _ => token.immediate(/[^\s#]+([ \t]+[^\s#]+)*/),
    entry: $ => seq(
      $.identifier,
      ':',
      optional($._ws),
      choice($.raw_string),
    ),

    raw_string: _ => token.immediate(seq("'", /[^'\n]*/, "'")),
    identifier: _ => /[a-z][a-zA-Z0-9_]*/,
    comment: _ => token(seq('#', /[^\n]*/)),
    _ws: _ => token.immediate(/[ \t]+/),
  },
});
