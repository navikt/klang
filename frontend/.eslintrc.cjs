const vitest = require('eslint-plugin-vitest');

module.exports = {
    "ignorePatterns": [
        "Dockerfile",
        "*.json",
        "*.md",
        ".*",
        "webpack.*"
    ],
    "extends": [
        "prettier",
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:import/typescript",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "sourceType": "module",
        "project": "./tsconfig.json"
    },
    "plugins": [
        "@typescript-eslint",
        "jsx-a11y",
        "react",
        "react-hooks",
        "prettier",
        "import",
        "prefer-arrow",
        "vitest"
    ],
    "settings": {
        "react": {
            "version": "18"
        },
        "import/parsers": {
            "@typescript-eslint/parser": [
                ".ts",
                ".tsx"
            ]
        },
        "import/resolver": {
            "typescript-bun": {
                "alwaysTryTypes": true,
                "project": "./tsconfig.json"
            }
        }
    },
    "root": true,
    "env": {
        "browser": true,
        "es6": true
    },
    "rules": {
        ...vitest.configs.recommended.rules,
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
            "error"
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
                "max": 23
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
        "import/first": "error",
        "import/newline-after-import": [
            "error",
            {
                "count": 1
            }
        ],
        "import/no-cycle": "error",
        "import/no-default-export": "error",
        "import/no-duplicates": "error",
        "import/no-self-import": "error",
        "import/no-named-as-default": "error",
        "import/no-named-as-default-member": "error",
        "import/no-unresolved": ['error', { ignore: ['bun:test'] }],
        "import/no-unused-modules": [
            "error",
            {
                "unusedExports": true,
                "missingExports": true,
                "src": [
                    "./src"
                ],
                "ignoreExports": [
                    "./src/index.tsx",
                    "./src/**/*.test.ts"
                ]
            }
        ],
        "import/order": [
            "error",
            {
                "groups": [
                    "builtin",
                    "external",
                    "internal",
                    "parent",
                    "sibling",
                    "index",
                    "object"
                ],
                "newlines-between": "never",
                "alphabetize": {
                    "order": "asc"
                }
            }
        ],
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
                "max": 200,
                "skipBlankLines": false,
                "skipComments": true
            }
        ],
        "no-alert": "error",
        "no-console": [
            "warn",
            {
                "allow": [
                    "warn",
                    "error",
                    "info"
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
            },
            {
                "name": "close",
                "message": "Don't use global close()"
            },
            {
                "name": "DocumentType",
                "message": "Import DocumentType locally"
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
        "prefer-arrow/prefer-arrow-functions": [
            "warn",
            {
                "disallowPrototype": true,
                "singleReturnOnly": false,
                "classPropertiesAllowed": false
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
        "react-hooks/exhaustive-deps": "error",
        "react-hooks/rules-of-hooks": "error",
        "react/jsx-boolean-value": ["error", "never"],
        "react/jsx-curly-brace-presence": "error",
        "react/prop-types": "off",
        "react/react-in-jsx-scope": "off",
        "react/self-closing-comp": ["error"],
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
    },
    "overrides": [{
        "files": [
            "**/**.test.{ts,tsx}"
        ],
    }]
}