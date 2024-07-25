// @ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = (phase, context) => {
  /**
   * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
   **/
  let productionNextConfig = {
    nx: {
      // Set this to true if you would like to use SVGR
      // See: https://github.com/gregberge/svgr
      svgr: false,
    },
    async redirects() {
      return [
        {
          source: '/',
          destination: '/home',
          permanent: true,
        },
      ];
    },
  };

  if (phase === PHASE_DEVELOPMENT_SERVER)
    productionNextConfig = {
      ...productionNextConfig,
      images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'images.unsplash.com',
          },
          {
            protocol: 'https',
            hostname: 'cloudflare-ipfs.com',
          },
          {
            protocol: 'https',
            hostname: 'avatars.githubusercontent.com',
          },
        ],
      },
    };

  return composePlugins(...plugins)(productionNextConfig)(phase, context);
};
