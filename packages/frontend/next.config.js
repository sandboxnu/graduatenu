/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  experimental: {
    // this will allow nextjs to resolve files (js, ts, css)
    // outside packages/app directory.
    externalDir: true,
  },
};

module.exports = nextConfig;
