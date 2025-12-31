import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

/* ------------------------------------------------------------------
   BASE PATH DINAMICO (DEV / PROD / LOCALE)
   ------------------------------------------------------------------ */

// Default locale: coerente con la tua configurazione attuale
const rawBase = process.env.APP_BASE_PATH || '/area-riservata-triono';

// Normalizza:
// - deve iniziare con "/"
// - NON deve finire con "/"
const base = (() => {
  let b = String(rawBase).trim();
  if (!b.startsWith('/')) b = `/${b}`;
  if (b.length > 1 && b.endsWith('/')) b = b.slice(0, -1);
  return b;
})();

/* ------------------------------------------------------------------
   PATCH VITE ERROR OVERLAY
   ------------------------------------------------------------------ */

// Patches node_modules/vite/dist/client/client.mjs
function patchViteErrorOverlay() {
  return {
    name: 'patch-vite-error-overlay',
    transform(code, id) {
      if (id.includes('vite/dist/client/client.mjs')) {
        return code.replace(
          /const editorLink = this\.createLink\(`Open in editor\${[^}]*}\`, void 0\);[\s\S]*?codeHeader\.appendChild\(editorLink\);/g,
          ''
        );
      }
    },
  };
}

/* ------------------------------------------------------------------
   INJECT DEV SCRIPT (solo in dev)
   ------------------------------------------------------------------ */

function injectDevScript(options = {}) {
  const { scriptPath } = options;

  if (!scriptPath) {
    throw new Error('injectDevScript requires a scriptPath');
  }

  return {
    name: 'inject-dev-script',
    hooks: {
      'astro:config:setup': ({ injectScript, command, logger }) => {
        if (command === 'dev') {
          logger.info(`Injecting dev script: ${scriptPath}`);
          injectScript('page', `import "${scriptPath}";`);
        }
      },
    },
  };
}

/* ------------------------------------------------------------------
   ASTRO CONFIG
   ------------------------------------------------------------------ */

export default defineConfig({
  base,

  output: 'server',

  devToolbar: {
    enabled: false,
  },

  server: {
    port: 3000,
    host: true,      // Listen on all network interfaces
    strictPort: true,
  },

  adapter: cloudflare({
    platformProxy: {
      enabled: false,
    },
  }),

  integrations: [
    react(),
    injectDevScript({ scriptPath: '/generated/dev-only.js' }),
  ],

  security: {
    checkOrigin: false, // Disabilita il controllo CSRF origin
  },

  vite: {
    plugins: [
      tailwindcss(),
      patchViteErrorOverlay(),
    ],

    server: {
      watch: {
        usePolling: true,
        interval: 1000,
        ignored: [
          '**/lost+found/**',
          '**/dist/**',
          '**/node_modules/**',
          '**/src/site-components/**',
        ],
      },
    },

    resolve: {
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19
      alias: import.meta.env.PROD
        ? {
            'react-dom/server': 'react-dom/server.edge',
          }
        : undefined,
    },
  },
});