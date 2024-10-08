const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
    js.configs.recommended,
    {
        languageOptions: {
            sourceType: "commonjs",
            globals: {
                ...globals.node,
            },
        },
        rules: {
            "semi": [
                "error",
                "always",
                {
                    omitLastInOneLineBlock: true,
                },
            ],
            "no-extra-semi": "error",
            "no-unused-vars": [
                "error",
                {
                    vars: "all",
                    args: "none",
                    caughtErrors: "none",
                },
            ],
            "indent": [
                "error",
                4,
                {
                    SwitchCase: 1,
                },
            ],
            "quotes": [
                "error",
                "double",
            ],
            "quote-props": [
                "error",
                "consistent-as-needed",
            ],
            "no-var": "error",
            "prefer-const": [
                "error",
                {
                    destructuring: "all",
                },
            ],
            "brace-style": [
                "error",
                "1tbs",
                {
                    allowSingleLine: true,
                },
            ],
            "comma-dangle": [
                "error",
                "always-multiline",
            ],
            "comma-spacing": [
                "error",
                {
                    before: false,
                    after: true,
                },
            ],
            "comma-style": "error",
            "curly": [
                "error",
                "multi-or-nest",
            ],
            "dot-location": [
                "error",
                "property",
            ],
            "max-nested-callbacks": [
                "error",
                {
                    max: 5,
                },
            ],
            "max-statements-per-line": [
                "error",
                {
                    max: 5,
                },
            ],
            "no-empty-function": [
                "error",
                {
                    allow: [
                        "arrowFunctions",
                    ],
                },
            ],
            "no-floating-decimal": "error",
            "no-lonely-if": "error",
            "no-multi-spaces": "error",
            "no-multiple-empty-lines": [
                "error",
                {
                    max: 1,
                },
            ],
            "no-trailing-spaces": [
                "error",
                {
                    ignoreComments: true,
                },
            ],
            "object-curly-spacing": [
                "error",
                "always",
                {
                    arraysInObjects: true,
                    objectsInObjects: true,
                },
            ],
            "space-before-blocks": [
                "error",
                "always",
            ],
            "space-before-function-paren": [
                "error",
                {
                    anonymous: "never",
                    named: "never",
                    asyncArrow: "always",
                },
            ],
            "space-in-parens": "error",
            "yoda": [
                "error",
                "never",
                {
                    exceptRange: true,
                },
            ],
            "no-return-assign": "error",
            "no-lone-blocks": "error",
            "no-new-func": "error",
            "no-self-compare": "error",
            "no-sequences": "error",
            "no-unused-expressions": [
                "error",
                {
                    allowTernary: true,
                },
            ],
            "no-useless-call": "error",
            "no-useless-escape": "error",
            "no-async-promise-executor": "off",
        },
    },
];