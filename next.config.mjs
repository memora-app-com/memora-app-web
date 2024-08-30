/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jfxwfgimhtqudpickaru.supabase.co",
        port: "",
      },
      {
        hostname: "flowbite.s3.amazonaws.com", // TODO: Delete this after demo
      },
    ],
  },
};

export default nextConfig;
