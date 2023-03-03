// @ts-check

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    // prevent API rate limiting during build
    // https://github.com/vercel/next.js/discussions/18550#discussioncomment-3284668

    // When enabled, it allows parallel threads
    // with nextjs automatic static generation
    workerThreads: false,
    cpus: 1,
  },
  images: {
    domains: [
      "axiecdn.axieinfinity.com",
      "assets.axieinfinity.com",
      "cdn.axieinfinity.com",
      "res.cloudinary.com",
    ],
  },

  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  // i18n: {
  //   locales: ["en"],
  //   defaultLocale: "en",
  // },
};
export default config;
