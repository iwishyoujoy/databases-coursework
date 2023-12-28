/** @type {import('next').NextConfig} */
module.exports = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'i.pinimg.com',
        },
        {
          protocol: 'https',
          hostname: 'avatars.mds.yandex.net',
        },
      ],
    },
    async redirects() {
      return [
        {
          source: '/',
          destination: '/products',
          permanent: true,
        },
      ]
    },
  }