import { defineConfig } from "oxfmt";

export default defineConfig({
  // This starter includes the author's preferred default formatting configuration.
  // Adapt these options based on your project's requirements and conventions.
  // Documentation: https://oxc.rs/docs/guide/usage/formatter.html
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  jsxSingleQuote: false,
  quoteProps: "as-needed",
  trailingComma: "all",
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",
  endOfLine: "lf",
  insertFinalNewline: true,
  objectWrap: "preserve",
  embeddedLanguageFormatting: "auto",
  sortPackageJson: false,
});
