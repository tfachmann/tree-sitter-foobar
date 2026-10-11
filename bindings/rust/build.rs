fn main() {
    let src_dir = std::path::Path::new("src");

    let mut c_config = cc::Build::new();
    c_config.std("c11").include(src_dir);

    #[cfg(target_env = "msvc")]
    c_config.flag("-utf-8");

    if std::env::var("TARGET").unwrap() == "wasm32-unknown-unknown" {
        let Ok(wasm_headers) = std::env::var("DEP_TREE_SITTER_LANGUAGE_WASM_HEADERS") else {
            panic!("Environment variable DEP_TREE_SITTER_LANGUAGE_WASM_HEADERS must be set by the language crate");
        };
        let Ok(wasm_src) =
            std::env::var("DEP_TREE_SITTER_LANGUAGE_WASM_SRC").map(std::path::PathBuf::from)
        else {
            panic!("Environment variable DEP_TREE_SITTER_LANGUAGE_WASM_SRC must be set by the language crate");
        };

        c_config.include(&wasm_headers);
        c_config.files([
            wasm_src.join("stdio.c"),
            wasm_src.join("stdlib.c"),
            wasm_src.join("string.c"),
        ]);
    }

    let parser_path = src_dir.join("parser.c");
    c_config.file(&parser_path);
    println!("cargo:rerun-if-changed={}", parser_path.to_str().unwrap());

    let scanner_path = src_dir.join("scanner.c");
    if scanner_path.exists() {
        c_config.file(&scanner_path);
        println!("cargo:rerun-if-changed={}", scanner_path.to_str().unwrap());
    }

    c_config.compile("tree-sitter-foobar");

    name_constants(&src_dir.join("node-types.json"));

    println!("cargo:rustc-check-cfg=cfg(with_highlights_query)");
    if !"queries/highlights.scm".is_empty()
        && std::path::Path::new("queries/highlights.scm").exists()
    {
        println!("cargo:rustc-cfg=with_highlights_query");
    }
    println!("cargo:rustc-check-cfg=cfg(with_injections_query)");
    if !"queries/injections.scm".is_empty()
        && std::path::Path::new("queries/injections.scm").exists()
    {
        println!("cargo:rustc-cfg=with_injections_query");
    }
    println!("cargo:rustc-check-cfg=cfg(with_locals_query)");
    if !"queries/locals.scm".is_empty() && std::path::Path::new("queries/locals.scm").exists() {
        println!("cargo:rustc-cfg=with_locals_query");
    }
    println!("cargo:rustc-check-cfg=cfg(with_tags_query)");
    if !"queries/tags.scm".is_empty() && std::path::Path::new("queries/tags.scm").exists() {
        println!("cargo:rustc-cfg=with_tags_query");
    }
}

/// Constants for the grammar's names
/// - `node_kinds.rs`: every named node kind (`pub const ENTRY: &str = "entry";`)
/// - `keywords.rs`: every keyword, the anonymous tokens that are words (`pub const USE: &str = "use";`)
fn name_constants(node_types: &std::path::Path) {
    println!("cargo:rerun-if-changed={}", node_types.display());
    let json = std::fs::read_to_string(node_types).expect("src/node-types.json exists");
    let types: Vec<serde_json::Value> = serde_json::from_str(&json).expect("valid node-types.json");
    let consts = |named: bool| -> String {
        types
            .iter()
            .filter(|t| t["named"] == named)
            .map(|t| t["type"].as_str().expect("node type is a string"))
            .filter(|name| named || name.chars().all(|c| c.is_ascii_alphabetic()))
            .map(|name| format!("pub const {}: &str = {name:?};\n", name.to_uppercase()))
            .collect()
    };
    let out_dir = std::path::PathBuf::from(std::env::var("OUT_DIR").unwrap());
    std::fs::write(out_dir.join("node_kinds.rs"), consts(true)).unwrap();
    std::fs::write(out_dir.join("keywords.rs"), consts(false)).unwrap();
}
