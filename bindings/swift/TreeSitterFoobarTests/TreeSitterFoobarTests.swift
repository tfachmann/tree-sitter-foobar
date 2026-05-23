import XCTest
import SwiftTreeSitter
import TreeSitterFoobar

final class TreeSitterFoobarTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_foobar())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Foobar grammar")
    }
}
