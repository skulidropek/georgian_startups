import nextVitals from "eslint-config-next/core-web-vitals"
import nextTypeScript from "eslint-config-next/typescript"
import globals from "globals"

const eslintConfig = [
  {
    ignores: [".next/**", "coverage/**", "dist/**", "node_modules/**"]
  },
  ...nextVitals,
  ...nextTypeScript,
  {
    files: ["tests/**/*.ts", "vitest.config.ts", "next.config.ts"],
    languageOptions: {
      globals: globals.node
    }
  }
]

export default eslintConfig
