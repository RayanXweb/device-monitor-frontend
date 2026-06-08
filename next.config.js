/** @type {import('next').NextConfig} */

// ============================================
// NEXT.JS CONFIGURATION FOR RAILWAY DEPLOYMENT
// ============================================

const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';
const isRailway = process.env.RAILWAY_ENVIRONMENT === 'production';

// Security headers configuration
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), fullscreen=(self)',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://js.sentry-cdn.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https: wss: ws:",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; '),
  },
];

// Content Security Policy for development
const devSecurityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
];

const nextConfig = {
  // ============================================
  // GENERAL CONFIGURATION
  // ============================================
  reactStrictMode: true,
  swcMinify: true,
  productionBrowserSourceMaps: !isProd,
  compiler: {
    removeConsole: isProd ? {
      exclude: ['error', 'warn'],
    } : false,
    styledComponents: true,
  },

  // ============================================
  // IMAGE CONFIGURATION
  // ============================================
  images: {
    domains: [
      'avatars.githubusercontent.com',
      'ui-avatars.com',
      'images.unsplash.com',
      'lh3.googleusercontent.com',
      'platform-lookaside.fbsbx.com',
      'cdn.discordapp.com',
      's.gravatar.com',
    ],
    unoptimized: isRailway ? false : true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // ============================================
  // ENVIRONMENT VARIABLES (Exposed to client)
  // ============================================
  env: {
    // App Information
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
    NEXT_PUBLIC_APP_DESCRIPTION: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    
    // API & WebSocket URLs
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
    NEXT_PUBLIC_API_TIMEOUT: process.env.NEXT_PUBLIC_API_TIMEOUT,
    
    // Feature Flags
    NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
    NEXT_PUBLIC_ENABLE_SENTRY: process.env.NEXT_PUBLIC_ENABLE_SENTRY,
    NEXT_PUBLIC_ENABLE_MONITORING: process.env.NEXT_PUBLIC_ENABLE_MONITORING,
    NEXT_PUBLIC_ENABLE_PWA: process.env.NEXT_PUBLIC_ENABLE_PWA,
    NEXT_PUBLIC_ENABLE_OFFLINE_MODE: process.env.NEXT_PUBLIC_ENABLE_OFFLINE_MODE,
    NEXT_PUBLIC_ENABLE_PUSH_NOTIFICATIONS: process.env.NEXT_PUBLIC_ENABLE_PUSH_NOTIFICATIONS,
    NEXT_PUBLIC_ENABLE_WEBSOCKET: process.env.NEXT_PUBLIC_ENABLE_WEBSOCKET,
    
    // Map Configuration
    NEXT_PUBLIC_MAP_PROVIDER: process.env.NEXT_PUBLIC_MAP_PROVIDER,
    NEXT_PUBLIC_MAP_TILE_URL: process.env.NEXT_PUBLIC_MAP_TILE_URL,
    NEXT_PUBLIC_MAP_ATTRIBUTION: process.env.NEXT_PUBLIC_MAP_ATTRIBUTION,
    NEXT_PUBLIC_DEFAULT_LATITUDE: process.env.NEXT_PUBLIC_DEFAULT_LATITUDE,
    NEXT_PUBLIC_DEFAULT_LONGITUDE: process.env.NEXT_PUBLIC_DEFAULT_LONGITUDE,
    NEXT_PUBLIC_DEFAULT_ZOOM: process.env.NEXT_PUBLIC_DEFAULT_ZOOM,
    
    // PWA Configuration
    NEXT_PUBLIC_PWA_ENABLED: process.env.NEXT_PUBLIC_PWA_ENABLED,
    NEXT_PUBLIC_PWA_CACHE_VERSION: process.env.NEXT_PUBLIC_PWA_CACHE_VERSION,
    NEXT_PUBLIC_PWA_THEME_COLOR: process.env.NEXT_PUBLIC_PWA_THEME_COLOR,
    NEXT_PUBLIC_PWA_BACKGROUND_COLOR: process.env.NEXT_PUBLIC_PWA_BACKGROUND_COLOR,
    
    // UI Configuration
    NEXT_PUBLIC_DEFAULT_THEME: process.env.NEXT_PUBLIC_DEFAULT_THEME,
    NEXT_PUBLIC_DEFAULT_LANGUAGE: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE,
    NEXT_PUBLIC_DEFAULT_TIMEZONE: process.env.NEXT_PUBLIC_DEFAULT_TIMEZONE,
    NEXT_PUBLIC_DATE_FORMAT: process.env.NEXT_PUBLIC_DATE_FORMAT,
    
    // Pagination
    NEXT_PUBLIC_DEFAULT_PAGE_SIZE: process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE,
    NEXT_PUBLIC_DEVICES_PER_PAGE: process.env.NEXT_PUBLIC_DEVICES_PER_PAGE,
    
    // Debug
    NEXT_PUBLIC_DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE,
    NEXT_PUBLIC_DEV_TOOLS: process.env.NEXT_PUBLIC_DEV_TOOLS,
    
    // Analytics (Optional)
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },

  // ============================================
  // REWRITES & REDIRECTS
  // ============================================
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
      {
        source: '/socket.io/:path*',
        destination: `${process.env.NEXT_PUBLIC_WS_URL}/socket.io/:path*`,
      },
      {
        source: '/health',
        destination: '/api/health',
      },
      {
        source: '/metrics',
        destination: '/api/metrics',
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/old-dashboard',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/old-devices',
        destination: '/devices',
        permanent: true,
      },
      {
        source: '/old-settings',
        destination: '/settings',
        permanent: true,
      },
    ];
  },

  // ============================================
  // HEADERS
  // ============================================
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: isProd ? securityHeaders : devSecurityHeaders,
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ];
  },

  // ============================================
  // BUILD & OUTPUT CONFIGURATION
  // ============================================
  output: 'standalone',
  generateEtags: true,
  poweredByHeader: false,
  compress: true,
  httpAgentOptions: {
    keepAlive: true,
  },
  
  // ============================================
  // WEBPACK CONFIGURATION
  // ============================================
  webpack: (config, { isServer, dev }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
            },
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              chunks: 'all',
            },
            recharts: {
              test: /[\\/]node_modules[\\/]recharts[\\/]/,
              name: 'recharts',
              chunks: 'all',
            },
            icons: {
              test: /[\\/]node_modules[\\/]react-icons[\\/]/,
              name: 'react-icons',
              chunks: 'all',
            },
          },
        },
      };
    }

    // Add fallback for node modules
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        path: false,
        os: false,
      };
    }

    // Add custom loaders
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },

  // ============================================
  // EXPERIMENTAL FEATURES
  // ============================================
  experimental: {
    optimizeCss: isProd,
    optimizePackageImports: [
      'react-icons',
      'recharts',
      'date-fns',
      'lodash',
      '@mui/material',
    ],
    scrollRestoration: true,
    legacyBrowsers: false,
    browserFieldsForced: false,
    largePageDataBytes: 128 * 1000,
    adjustFontFallbacks: true,
    fontLoaders: [
      { loader: '@next/font/google', options: { subsets: ['latin'] } },
    ],
    turbo: {
      loaders: {
        '.svg': ['@svgr/webpack'],
      },
    },
  },

  // ============================================
  // SERVER RUNTIME CONFIGURATION
  // ============================================
  serverRuntimeConfig: {
    port: process.env.PORT || 3000,
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    wsUrl: process.env.NEXT_PUBLIC_WS_URL,
  },

  // ============================================
  // PUBLIC RUNTIME CONFIGURATION
  // ============================================
  publicRuntimeConfig: {
    appName: process.env.NEXT_PUBLIC_APP_NAME,
    appVersion: process.env.NEXT_PUBLIC_APP_VERSION,
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    wsUrl: process.env.NEXT_PUBLIC_WS_URL,
  },

  // ============================================
  // TRAILING SLASH & URL NORMALIZATION
  // ============================================
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,

  // ============================================
  // ON ERROR HANDLING
  // ============================================
  onError: (err, req, res) => {
    console.error('Next.js error:', err);
    if (isProd) {
      // Send to error tracking service
      if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
        // Sentry.captureException(err);
      }
    }
  },
};

// ============================================
// WITH PWA PLUGIN (Optional)
// ============================================
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: !isProd,
  buildExcludes: [/middleware-manifest.json$/],
  fallbacks: {
    document: '/~offline',
  },
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'imageCache',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
      },
    },
    {
      urlPattern: /\.(?:js|css)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'staticResourceCache',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 24 * 60 * 60,
        },
      },
    },
  ],
});

// ============================================
// WITH BUNDLE ANALYZER (Optional)
// ============================================
let finalConfig = nextConfig;

if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  });
  finalConfig = withBundleAnalyzer(finalConfig);
}

// Apply PWA only if enabled
if (process.env.NEXT_PUBLIC_PWA_ENABLED === 'true') {
  finalConfig = withPWA(finalConfig);
}

// ============================================
// EXPORT CONFIGURATION
// ============================================
module.exports = finalConfig;
