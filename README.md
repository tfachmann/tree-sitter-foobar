# Tree-Sitter foobar
An (minimal) example to write your own tree sitter grammar!

## Setup a new language

Following [tree-sitter/..#project-setup](https://tree-sitter.github.io/tree-sitter/creating-parsers/1-getting-started.html#project-setup).

```sh
mkdir tree-sitter-foobar
cd tree-sitter-foobar
```

```sh
tree-sitter init
```

<details>
  <summary>output</summary>

```
tree-sitter init
✔ Parser name · foobar
✔ CamelCase name · Foobar
✔ Title (human-readable name) · Foobar
✔ Description · Grammar for example language Foobar
✔ Repository URL · https://github.com/tfachmann/tree-sitter-foobar
✔ Funding URL ·
✔ TextMate scope · source.foobar
✔ File types (space-separated) · foobar
✔ Version · 0.1.0
✔ License · MIT
✔ Author name · tfachmann
✔ Author email · tfachmann@proton.me
✔ Author URL · https://github.com/tfachmann
✔ Package namespace · io.github.tree-sitter
Bindings: c, go, node, python, rust, swift
Your current configuration:
{
  "name": "foobar",
  "camelcase": "Foobar",
  "title": "Foobar",
  "description": "Grammar for example language Foobar",
  "repository": "https://github.com/tfachmann/tree-sitter-foobar",
  "funding": "",
  "scope": "source.foobar",
  "file_types": [
    "foobar"
  ],
  "version": "0.1.0",
  "license": "MIT",
  "author": "tfachmann",
  "email": "tfachmann@proton.me",
  "url": "https://github.com/tfachmann",
  "namespace": "io.github.tree-sitter",
  "bindings": {
    "c": true,
    "go": true,
    "java": false,
    "node": true,
    "python": true,
    "rust": true,
    "swift": true,
    "zig": false
  }
}
✔ Does the config above look correct? · yes
```

</details>

This creates all important files, you may verify by listing the directory.

<details>
  <summary><code>tree .</code></summary>

```
.
├── CMakeLists.txt
├── Cargo.toml
├── Makefile
├── Package.swift
├── README.md
├── binding.gyp
├── bindings
│   ├── c
│   │   ├── tree-sitter-foobar.pc.in
│   │   └── tree_sitter
│   │       └── tree-sitter-foobar.h
│   ├── go
│   │   ├── binding.go
│   │   └── binding_test.go
│   ├── node
│   │   ├── binding.cc
│   │   ├── binding_test.js
│   │   ├── index.d.ts
│   │   └── index.js
│   ├── python
│   │   ├── tests
│   │   │   └── test_binding.py
│   │   └── tree_sitter_foobar
│   │       ├── __init__.py
│   │       ├── __init__.pyi
│   │       ├── binding.c
│   │       └── py.typed
│   ├── rust
│   │   ├── build.rs
│   │   └── lib.rs
│   └── swift
│       ├── TreeSitterFoobar
│       │   └── foobar.h
│       └── TreeSitterFoobarTests
│           └── TreeSitterFoobarTests.swift
├── go.mod
├── grammar.js
├── package.json
├── pyproject.toml
├── setup.py
└── tree-sitter.json

13 directories, 29 files
```

</details>

```sh
npm install --ignore-scripts
tree-sitter generate
```

## Editor Setup

Complete setups including the language server (Neovim, Helix, Emacs, Kate, Zed, VS Code) live in
[`foobar-language-server/editors`](https://github.com/tfachmann/foobar-language-server/tree/main/editors).
The snippet below only registers the grammar with nvim-treesitter.

<details>

  <summary>Neovim</summary>

```lua
vim.filetype.add({
  pattern = {
    [".*.foobar"] = "foobar",
  },
})

vim.api.nvim_create_autocmd("User", {
  pattern = "TSUpdate",
  callback = function()
    require("nvim-treesitter.parsers").foobar = {
      install_info = {
        path = "/local/path/to/lsp/tree-sitter-foobar",
        generate = false,
        queries = "queries",
      },
      tier = 2,
    }
  end,
})
```

In neovim, then do

```
:TSInstall foobar
```

After changing the grammar, rebuild the parser with

```
:TSUpdate foobar
```

</details>

## Formatting

[Topiary](https://topiary.tweag.io) formats `foobar` with the rules in `queries/formatting.scm`.
`.topiary/languages.ncl` registers the language for this repository:

```sh
tree-sitter build -o parser.so
topiary format --check share/      # list what would change
topiary format share/example.foobar
```

To use it elsewhere, point `-C` at that file (`topiary -C /path/to/tree-sitter-foobar/.topiary/languages.ncl format ...`).
The Rust binding exports the same rules as `FORMATTING_QUERY`; `foobar fmt` and format-on-save in `foobar lsp` use them.
