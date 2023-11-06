/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
};

const removeImports = require("next-remove-imports")();

module.exports = removeImports(nextConfig);
