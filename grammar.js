/**
 * @file Grammar for example language Foobar
 * @author tfachmann <tfachmann@proton.me>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "foobar",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
