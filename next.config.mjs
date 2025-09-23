/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sr360developmentstorage.blob.core.windows.net",
        pathname: "/**", 
      },
    ],
  },
};

export default nextConfig;
