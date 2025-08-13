#!/usr/local/bin/eslint -c

import js from "@eslint/js";
import jsdoc from "eslint-plugin-jsdoc";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		ignores: [
			"**/node_modules/**",
			"minified/**"
		]
	},
	{
		files: ["**/*.{js,mjs,cjs}"],
		plugins: { js, jsdoc },
		extends: [
			js.configs.recommended,
			jsdoc.configs["flat/recommended"]
		],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			},
		},
		rules: {
			"eqeqeq": ["error", "always"],
			"init-declarations": ["warn", "always"],
			"no-cond-assign": "warn",
			"no-constant-condition": "error",
			"no-else-return": "error",
			"no-throw-literal": "error",
			"prefer-const": "error",
			"semi": ["error", "always"]
		}
	}
]);
