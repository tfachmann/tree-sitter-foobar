# Topiary configuration for foobar. Paths are relative to this file.
# Build the grammar first: `tree-sitter build -o parser.so`.
{
  languages = {
    foobar = {
      extensions = ["foobar"],
      indent = "  ",
      grammar.source.path = "../parser.so",
      queries.formatting.source.path = "../queries/formatting.scm",
    },
  },
}
