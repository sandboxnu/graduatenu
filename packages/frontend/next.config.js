/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  experimental: {
    // this will allow nextjs to resolve files (js, ts, css)
    // outside packages/app directory.
    externalDir: true,
  },
  async redirects() {
    return [
      // The GraduateNU API has been decommissioned, so every page here fails on
      // its first request. Send all traffic to the replacement on SearchNEU.
      {
        source: "/:path*",
        destination: "https://searchneu.com/graduate",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
