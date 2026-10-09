/**
 * @file Grammar for example language Foobar
 * @author tfachmann <tfachmann@proton.me>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "foobar",
  word: $ => $.identifier,
  extras: $ => [/[ \t\r\n]+/, $.comment],

  rules: {
    source_file: $ => repeat(choice(
      $.section_defines,
      $.section_process,
      $.section_template,
      $.include,
    )),
    section_defines: $ => seq('defines', repeat($.entry)),
    section_template: $ => seq(
      'template',
      $._ws,
      $.identifier,
      $.parameters,
      repeat($.entry)),
    section_process: $ => seq(
      'process',
      $._ws,
      $.name,
      repeat(choice($.entry, $.use))
    ),
    include: $ => seq('include', $._ws, $.path),

    use: $ => seq('use', $._ws, $.identifier, $.arguments),

    parameters: $ => seq(
      '(',
      optional(seq($.identifier, repeat(seq(',', $.identifier)))),
      ')'),

    arguments: $ => seq(
      '(',
      optional(seq($.argument, repeat(seq(',', $.argument)))),
      ')'),
    argument: $ => seq(
      $.identifier,
      ':',
      optional($._ws),
      choice($.string, $.raw_string)),
    name: _ => token.immediate(/[^\s#]+([ \t]+[^\s#]+)*/),
    path: _ => token.immediate(/[A-Za-z0-9_./-]+/),
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
