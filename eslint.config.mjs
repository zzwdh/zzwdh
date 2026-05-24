import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import astro from "eslint-plugin-astro";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [".astro/", "dist/", "node_modules/", "public/vendor/", "assets/", "package-lock.json"]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports"
        }
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ]
    }
  },
  {
    files: ["src/scripts/**/*.ts", "**/*.astro/*.js"],
    languageOptions: {
      globals: globals.browser
    }
  },
  {
    files: [
      "*.config.{js,mjs,cjs}",
      "eslint.config.mjs",
      "astro.config.mjs",
      "prettier.config.mjs",
      "scripts/**/*.mjs"
    ],
    languageOptions: {
      globals: globals.node
    }
  },
  {
    files: ["src/**/*.astro"],
    rules: {
      "astro/no-set-html-directive": "error"
    }
  },
  eslintConfigPrettier
);
