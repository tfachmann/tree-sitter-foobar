export default grammar({
  name: "foobar",
  word: $ => $.identifier,
  extras: $ => [/[ \t\r\n]+/, $.comment],

  rules: {
    source_file: $ => repeat(choice(
      $.section_defines,
      $.section_process,
    )),
    section_defines: $ => seq('defines', repeat($.entry)),
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
      choice($.string, $.raw_string),
    ),

    string: $ => seq(
      token.immediate('"'),
      repeat(choice($.variable, $.string_content)),
      token.immediate('"'),
    ),
    string_content: _ => token.immediate(/([^"%\n]|%[^("\n])+|%/),
    variable: $ => seq(token.immediate('%('), $.identifier, ')'),

    raw_string: _ => token.immediate(seq("'", /[^'\n]*/, "'")),
    identifier: _ => /[a-z][a-zA-Z0-9_]*/,
    comment: _ => token(seq('#', /[^\n]*/)),
    _ws: _ => token.immediate(/[ \t]+/),
  },
});
