/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  swcMinify: true,
  publicRuntimeConfig: {
    // Will be available on both server and client
    APP_NAME: "COIN_PLANET",
    API: "http://localhost:5000/api",
    PRODUCTION: false,
    DOMAIN: "http://localhost:3000",
  },
  images: {
    domains: ["i.gadgets360cdn.com", "gadgets.ndtv.com", "drop.ndtv.com"],
  },
};

module.exports = nextConfig;
