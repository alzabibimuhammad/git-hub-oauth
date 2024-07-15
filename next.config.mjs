/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  redirects: async () => [
    {
      source: "/",
      destination: "/repo",
      permanent: true,
    },
  ],
};

export default nextConfig;
