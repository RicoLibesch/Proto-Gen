/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  env: {
    BACKEND: "http://localhost:8080"
  }
};

const removeImports = require("next-remove-imports")();

module.exports = removeImports(nextConfig);
