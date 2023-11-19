/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  env: {
    BACKEND: "http://5.249.164.172:8080"
  }
};

const removeImports = require("next-remove-imports")();

module.exports = removeImports(nextConfig);
