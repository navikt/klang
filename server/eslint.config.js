import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [{
    languageOptions: {
        globals: globals.node,
        parserOptions: {
            project: "./tsconfig.json"
        }

    }
},
pluginJs.configs.recommended,
...tseslint.configs.recommended,
    eslintPluginPrettierRecommended,
{
    "rules": {
        "@typescript-eslint/array-type": "error",
        "@typescript-eslint/consistent-type-definitions": [
            "error",
            "interface"
        ],
        "@typescript-eslint/consistent-type-imports": [
            "error",
            {
                "prefer": "no-type-imports"
            }
        ],
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-base-to-string": "error",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-shadow": [
            "error"
        ],
        "@typescript-eslint/no-unsafe-assignment": "error",
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                "args": "all",
                "argsIgnorePattern": "^_",
                "caughtErrors": "all",
                "caughtErrorsIgnorePattern": "^_",
                "destructuredArrayIgnorePattern": "^_",
                "ignoreRestSiblings": true
            }
        ],
        "@typescript-eslint/no-var-requires": 0,
        "@typescript-eslint/prefer-includes": "error",
        "@typescript-eslint/prefer-nullish-coalescing": "error",
        "@typescript-eslint/prefer-reduce-type-parameter": "error",
        "@typescript-eslint/restrict-template-expressions": [
            "error",
            {
                "allowNumber": true
            }
        ],
        "@typescript-eslint/strict-boolean-expressions": "error",
        "@typescript-eslint/switch-exhaustiveness-check": "error",
        "array-callback-return": "error",
        "arrow-body-style": [
            "error",
            "as-needed"
        ],
        "comma-dangle": [
            0,
            "never"
        ],
        "complexity": [
            "error",
            {
                "max": 20
            }
        ],
        "curly": [
            "error",
            "all"
        ],
        "eol-last": [
            "error",
            "always"
        ],
        "eqeqeq": "error",
        "keyword-spacing": [
            "error",
            {
                "before": true
            }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "max-depth": [
            "error",
            {
                "max": 4
            }
        ],
        "max-lines": [
            "error",
            {
                "max": 400,
                "skipBlankLines": false,
                "skipComments": true
            }
        ],
        "no-alert": "error",
        "no-console": [
            "error",
            {
                "allow": [
                    "warn",
                    "error",
                    "info",
                    "debug"
                ]
            }
        ],
        "no-debugger": "error",
        "no-duplicate-imports": "error",
        "no-else-return": "error",
        "no-eval": "error",
        "no-extend-native": "error",
        "no-implicit-coercion": "error",
        "no-lonely-if": "error",
        "no-nested-ternary": "error",
        "no-proto": "error",
        "no-restricted-globals": [
            "error",
            {
                "name": "event",
                "message": "Use local parameter instead."
            }
        ],
        "no-return-assign": [
            "error",
            "always"
        ],
        "no-shadow": "off",
        "no-unneeded-ternary": "error",
        "no-unused-vars": "off",
        "no-useless-rename": "error",
        "no-useless-return": "error",
        "no-var": "error",
        "object-shorthand": [
            "error",
            "always"
        ],
        "padded-blocks": [
            "error",
            "never"
        ],
        "padding-line-between-statements": [
            "error",
            {
                "blankLine": "always",
                "prev": "*",
                "next": [
                    "block",
                    "block-like",
                    "return"
                ]
            },
            {
                "blankLine": "never",
                "prev": "*",
                "next": [
                    "case",
                    "default"
                ]
            }
        ],
        "prefer-const": "error",
        "prefer-destructuring": "error",
        "prefer-object-spread": "error",
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "prettier/prettier": [
            "error",
            {
                "semi": true,
                "singleQuote": true,
                "printWidth": 120,
                "tabWidth": 2,
                "endOfLine": "lf"
            }
        ],
        "radix": [
            "error",
            "always"
        ],
        "sort-imports": [
            "error",
            {
                "ignoreDeclarationSort": true
            }
        ],
        "space-before-blocks": [
            "error",
            {
                "functions": "always",
                "keywords": "always",
                "classes": "always"
            }
        ],
        "yoda": [
            "error",
            "never"
        ]
    }
}
];