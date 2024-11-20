import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import preferArrow from "eslint-plugin-prefer-arrow";

export default [
  { ignores: ["dist", ".husky"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: { react: { version: "18.3" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "prefer-arrow": preferArrow,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "prefer-arrow-callback": "error",
      "prefer-arrow/prefer-arrow-functions": [
        "error",
        {
          disallowPrototype: true,
          singleReturnOnly: false,
          classPropertiesAllowed: false,
        },
      ],
      // Additional ESLint rules for ES6+ and best practices
      "no-var": "error", // Disallow var, use let and const instead
      "prefer-const": "error", // Prefer const over let when variables are not reassigned
      "arrow-spacing": ["error", { before: true, after: true }], // Enforce spacing around arrow function arrows
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ], // Disallow unused variables
      "no-duplicate-imports": "error", // Disallow duplicate imports
      "object-shorthand": "error", // Require object shorthand syntax
      "prefer-template": "error", // Prefer template literals over string concatenation
      "template-curly-spacing": ["error", "never"], // Enforce spacing in template literals
      "no-useless-rename": "error", // Disallow renaming import, export, and destructured assignments to the same name
      "no-useless-constructor": "error", // Disallow unnecessary constructors
      "no-const-assign": "error", // Disallow reassignment of const variables
      "no-new-symbol": "error", // Disallow new operators with the Symbol object
      "no-this-before-super": "error", // Disallow this/super before calling super() in constructors
      "require-yield": "error", // Require generator functions to contain yield
      "prefer-rest-params": "error", // Prefer rest parameters over arguments
      "prefer-spread": "error", // Prefer spread operator over .apply()
      "no-console": ["warn", { allow: ["warn", "error"] }], // Disallow console (warn instead of error)
    },
  },
];
