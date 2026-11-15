/*
 * A small tokenizer for the JSX the playground writes. Static code on the
 * site is highlighted on the server with Shiki; this covers the one place
 * code changes in the browser, with the same token colours.
 */

export type TokenKind =
  | "plain"
  | "keyword"
  | "string"
  | "comment"
  | "constant"
  | "function";

export type Token = { text: string; kind: TokenKind };

const PATTERN = new RegExp(
  [
    /(\/\/.*$)/, // 1 comment
    /("(?:[^"\\]|\\.)*")/, // 2 string
    /(<\/?)([A-Za-z][\w.]*)/, // 3, 4 tag
    /\b(import|from|export|const|return|function|type|default)\b/, // 5 keyword
    /(\b\d+(?:\.\d+)?\b|\b(?:true|false)\b)/, // 6 number or boolean
    /([A-Za-z_$][\w$-]*)/, // 7 identifier
    /(\/>|[{}>])/, // 8 structure
    /(\s+|[^])/, // 9 anything else
  ]
    .map((part) => part.source)
    .join("|"),
  "gm",
);

export function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  const push = (text: string, kind: TokenKind) => {
    const last = tokens[tokens.length - 1];
    if (last && last.kind === kind) last.text += text;
    else tokens.push({ text, kind });
  };

  // Inside an opening tag, and outside any {expression}, a bare word is a
  // prop name.
  let inTag = false;
  let braces = 0;

  for (const match of code.matchAll(PATTERN)) {
    const [text, comment, string, bracket, tag, keyword, number, word, mark] = match;
    if (comment) push(text, "comment");
    else if (string) push(text, "string");
    else if (tag) {
      push(bracket, "plain");
      push(tag, "constant");
      inTag = bracket === "<";
      braces = 0;
    } else if (keyword) push(text, "keyword");
    else if (number) push(text, "constant");
    else if (word) push(text, inTag && braces === 0 ? "function" : "plain");
    else if (mark) {
      if (mark === "{") braces += 1;
      else if (mark === "}") braces = Math.max(0, braces - 1);
      else if (braces === 0) inTag = false;
      push(text, "plain");
    } else push(text, "plain");
  }
  return tokens;
}
