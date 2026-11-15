import {
  createCssVariablesTheme,
  createHighlighter,
  type Highlighter,
} from "shiki";

export type CodeLanguage = "tsx" | "css" | "bash";

/*
 * Tokens are coloured with custom properties rather than fixed colours, so
 * one render serves both colour schemes. The palette is in globals.css, and
 * the live code in the playground uses the same properties.
 */
const theme = createCssVariablesTheme({
  name: "css-variables",
  variablePrefix: "--code-",
  variableDefaults: {},
  fontStyle: true,
});

let highlighter: Promise<Highlighter> | undefined;

/** Highlights code to HTML. Server only: the grammars never reach the client. */
export async function highlight(code: string, lang: CodeLanguage) {
  highlighter ??= createHighlighter({
    themes: [theme],
    langs: ["tsx", "css", "bash"],
  });
  return (await highlighter).codeToHtml(code, { lang, theme: "css-variables" });
}
