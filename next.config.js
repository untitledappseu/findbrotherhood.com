const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude Supabase functions directory from being processed by webpack
      config.module.rules.push({
        test: /\.tsx?$/,
        include: [path.resolve(__dirname, 'supabase/functions')],
        use: 'ignore-loader',
      });
    }
    return config;
  },
};

module.exports = nextConfig;