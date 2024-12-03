import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    ...compat.extends("@antfu", "./.eslintrc-auto-import.json", "@unocss").map(config => ({
        ...config,

        files: [
            "**/*.vue",
            "**/*.js",
            "**/*.jsx",
            "**/*.cjs",
            "**/*.mjs",
            "**/*.ts",
            "**/*.tsx",
            "**/*.cts",
            "**/*.mts",
        ],
    })),
    {
        files: [
            "**/*.vue",
            "**/*.js",
            "**/*.jsx",
            "**/*.cjs",
            "**/*.mjs",
            "**/*.ts",
            "**/*.tsx",
            "**/*.cts",
            "**/*.mts",
        ],

        rules: {
            "n/prefer-global/process": "off",
            curly: ["error", "all"],
            "@typescript-eslint/semi": ["error", "always"],

            "@typescript-eslint/no-use-before-define": ["error", {
                allowNamedExports: true,
                functions: false,
            }],

            "vue/no-empty-component-block": ["error"],

            "no-restricted-imports": ["error", {
                paths: [{
                    name: "@vueuse/core",
                    importNames: ["useClipboard"],
                    message: "Please use local useCopy from src/composable/copy.ts instead of useClipboard.",
                }],
            }],
        },
        ignores: [".gitignore"]
    },
];