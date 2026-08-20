# Favicon audit

- Existing HTML referenced only `/manus-storage/thinkoria-logo_8998c7d8.png` as a PNG icon.
- No root `/favicon.ico`, `/favicon.png`, 48px favicon, or apple-touch-icon existed in `client/public`.
- The storage URL works in the browser, but relying on the Manus storage proxy is less reliable for Google’s favicon crawler than a same-origin root asset.
- Generated same-origin assets from the existing square Thinkoria logo: `favicon.ico`, `favicon.png`, `favicon-48.png`, and `apple-touch-icon.png`.
- Preview verification confirmed `/favicon.ico` is served as a 48x48 image rather than the SPA fallback, and the homepage now renders the new icon declarations and updated social links.
